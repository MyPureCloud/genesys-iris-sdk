// This code implements the `-sMODULARIZE` settings by taking the generated
// JS program code (INNER_JS_CODE) and wrapping it in a factory function.
// When targetting node and ES6 we use `await import ..` in the generated code
// so the outer function needs to be marked as async.
async function IrisSDK(moduleArg={}){var moduleRtn;// include: shell.js
// include: minimum_runtime_check.js
// end include: minimum_runtime_check.js
// The Module object: Our interface to the outside world. We import
// and export values on it. There are various ways Module can be used:
// 1. Not defined. We create it here
// 2. A function parameter, function(moduleArg) => Promise<Module>
// 3. pre-run appended it, var Module = {}; ..generated code..
// 4. External script tag defines var Module.
// We need to check if Module already exists (e.g. case 3 above).
// Substitution will be replaced with actual code on later stage of the build,
// this way Closure Compiler will not mangle it (e.g. case 4. above).
// Note that if you want to run closure, and also to use Module
// after the generated code, you will need to define   var Module = {};
// before the code. Then that object will be used in the code, and you
// can continue to use Module afterwards as well.
var Module=moduleArg;// Determine the runtime environment we are in. You can customize this by
// setting the ENVIRONMENT setting at compile time (see settings.js).
var ENVIRONMENT_IS_WEB=true;var ENVIRONMENT_IS_WORKER=false;var thisProgram="./this.program";var _scriptName=import.meta.url;// `/` should be present at the end if `scriptDirectory` is not empty
var scriptDirectory="";function locateFile(path){return scriptDirectory+path}// Hooks that are implemented differently in different runtime environments.
var readAsync,readBinary;// Note that this includes Node.js workers when relevant (pthreads is enabled).
// Node.js workers are detected as a combination of ENVIRONMENT_IS_WORKER and
// ENVIRONMENT_IS_NODE.
if(ENVIRONMENT_IS_WEB||ENVIRONMENT_IS_WORKER){try{scriptDirectory=new URL(".",_scriptName).href}catch{}{// include: web_or_worker_shell_read.js
readAsync=async url=>{var response=await fetch(url,{credentials:"same-origin"});if(response.ok){return response.arrayBuffer()}throw new Error(response.status+" : "+response.url)}}}else{}var out=console.log.bind(console);var err=console.error.bind(console);// end include: shell.js
// include: preamble.js
// === Preamble library stuff ===
// Documentation for the public APIs defined in this file must be updated in:
//    site/source/docs/api_reference/preamble.js.rst
// A prebuilt local version of the documentation is available at:
//    site/build/text/docs/api_reference/preamble.js.txt
// You can also build docs locally as HTML or other formats in site/
// An online HTML version (which may be of a different version of Emscripten)
//    is up at http://kripken.github.io/emscripten-site/docs/api_reference/preamble.js.html
var wasmBinary=moduleArg.wasmBinary;// Wasm globals
//========================================
// Runtime essentials
//========================================
// whether we are quitting the application. no code should run after this.
// set in exit() and abort()
var ABORT=false;// include: runtime_common.js
// include: runtime_stack_check.js
// end include: runtime_stack_check.js
// include: runtime_exceptions.js
// end include: runtime_exceptions.js
// include: runtime_debug.js
// end include: runtime_debug.js
var readyPromiseResolve,readyPromiseReject;// Memory management
var/** @type {!Int8Array} */HEAP8,/** @type {!Uint8Array} */HEAPU8,/** @type {!Int16Array} */HEAP16,/** @type {!Uint16Array} */HEAPU16,/** @type {!Int32Array} */HEAP32,/** @type {!Uint32Array} */HEAPU32,/** @type {!Float32Array} */HEAPF32,/** @type {!Float64Array} */HEAPF64;// BigInt64Array type is not correctly defined in closure
var/** not-@type {!BigInt64Array} */HEAP64,/* BigUint64Array type is not correctly defined in closure
/** not-@type {!BigUint64Array} */HEAPU64;var runtimeInitialized=false;function updateMemoryViews(){var b=wasmMemory.buffer;HEAP8=new Int8Array(b);HEAP16=new Int16Array(b);HEAPU8=new Uint8Array(b);HEAPU16=new Uint16Array(b);HEAP32=new Int32Array(b);HEAPU32=new Uint32Array(b);Module["HEAPF32"]=HEAPF32=new Float32Array(b);HEAPF64=new Float64Array(b);HEAP64=new BigInt64Array(b);HEAPU64=new BigUint64Array(b)}// include: memoryprofiler.js
// end include: memoryprofiler.js
// end include: runtime_common.js
function preRun(){}function initRuntime(){runtimeInitialized=true;// No ATINITS hooks
wasmExports["ca"]()}function postRun(){}/** @param {string|number=} what */function abort(what){what="Aborted("+what+")";// TODO(sbc): Should we remove printing and leave it up to whoever
// catches the exception?
err(what);ABORT=true;what+=". Build with -sASSERTIONS for more info.";// Use a wasm runtime error, because a JS error might be seen as a foreign
// exception, which means we'd run destructors on it. We need the error to
// simply make the program stop.
// FIXME This approach does not work in Wasm EH because it currently does not assume
// all RuntimeErrors are from traps; it decides whether a RuntimeError is from
// a trap or not based on a hidden field within the object. So at the moment
// we don't have a way of throwing a wasm trap from JS. TODO Make a JS API that
// allows this in the wasm spec.
// Suppress closure compiler warning here. Closure compiler's builtin extern
// definition for WebAssembly.RuntimeError claims it takes no arguments even
// though it can.
// TODO(https://github.com/google/closure-compiler/pull/3913): Remove if/when upstream closure gets fixed.
/** @suppress {checkTypes} */var e=new WebAssembly.RuntimeError(what);readyPromiseReject?.(e);// Throw the error whether or not MODULARIZE is set because abort is used
// in code paths apart from instantiation where an exception is expected
// to be thrown when abort is called.
throw e}var wasmBinaryFile;function findWasmBinary(){if(Module["locateFile"]){return locateFile("iris-sdk-wasm.wasm")}// Use bundler-friendly `new URL(..., import.meta.url)` pattern; works in browsers too.
return new URL("iris-sdk-wasm.wasm",import.meta.url).href}function getBinarySync(file){if(readBinary){return readBinary(file)}// Throwing a plain string here, even though it not normally adviables since
// this gets turning into an `abort` in instantiateArrayBuffer.
throw"both async and sync fetching of the wasm failed"}async function getWasmBinary(binaryFile){// If we don't have the binary yet, load it asynchronously using readAsync.
if(!wasmBinary){// Fetch the binary using readAsync
try{var response=await readAsync(binaryFile);return new Uint8Array(response)}catch{}}// Otherwise, getBinarySync should be able to get it synchronously
return getBinarySync(binaryFile)}async function instantiateArrayBuffer(binaryFile,imports){try{var instance=await WebAssembly.instantiate(wasmBinary,imports);return instance}catch(reason){err(`failed to asynchronously prepare wasm: ${reason}`);abort(reason)}}async function instantiateAsync(binary,binaryFile,imports){if(!binary){try{var response=fetch(binaryFile,{credentials:"same-origin"});var instantiationResult=await WebAssembly.instantiateStreaming(response,imports);return instantiationResult}catch(reason){// We expect the most common failure cause to be a bad MIME type for the binary,
// in which case falling back to ArrayBuffer instantiation should work.
err(`wasm streaming compile failed: ${reason}`);err("falling back to ArrayBuffer instantiation")}}return instantiateArrayBuffer(binaryFile,imports)}function getWasmImports(){// prepare imports
var imports={"a":wasmImports};return imports}// Create the wasm instance.
// Receives the wasm imports, returns the exports.
async function createWasm(){// Load the wasm module and create an instance of using native support in the JS engine.
// handle a generated wasm instance, receiving its exports and
// performing other necessary setup
/** @param {WebAssembly.Module=} module*/function receiveInstance(instance,module){wasmExports=instance.exports;assignWasmExports(wasmExports);updateMemoryViews();return wasmExports}// Prefer streaming instantiation if available.
function receiveInstantiationResult(result){// 'result' is a ResultObject object which has both the module and instance.
// receiveInstance() will swap in the exports (to Module.asm) so they can be called
// TODO: Due to Closure regression https://github.com/google/closure-compiler/issues/3193, the above line no longer optimizes out down to the following line.
// When the regression is fixed, can restore the above PTHREADS-enabled path.
return receiveInstance(result["instance"])}var info=getWasmImports();var result=await instantiateAsync(wasmBinary,wasmBinaryFile,info);var exports=receiveInstantiationResult(result);return exports}// end include: preamble.js
// Begin JS library code
class ExitStatus{name="ExitStatus";constructor(status){this.message=`Program terminated with exit(${status})`;this.status=status}}class ExceptionInfo{// excPtr - Thrown object pointer to wrap. Metadata pointer is calculated from it.
constructor(excPtr){this.excPtr=excPtr;this.ptr=excPtr-24}set_type(type){HEAPU32[(((this.ptr)+(4))>>2)]=type}get_type(){return HEAPU32[(((this.ptr)+(4))>>2)]}set_destructor(destructor){HEAPU32[(((this.ptr)+(8))>>2)]=destructor}get_destructor(){return HEAPU32[(((this.ptr)+(8))>>2)]}set_caught(caught){caught=caught?1:0;HEAP8[(this.ptr)+(12)]=caught}get_caught(){return HEAP8[(this.ptr)+(12)]!=0}set_rethrown(rethrown){rethrown=rethrown?1:0;HEAP8[(this.ptr)+(13)]=rethrown}get_rethrown(){return HEAP8[(this.ptr)+(13)]!=0}// Initialize native structure fields. Should be called once after allocated.
init(type,destructor){this.set_adjusted_ptr(0);this.set_type(type);this.set_destructor(destructor)}set_adjusted_ptr(adjustedPtr){HEAPU32[(((this.ptr)+(16))>>2)]=adjustedPtr}get_adjusted_ptr(){return HEAPU32[(((this.ptr)+(16))>>2)]}}var exceptionLast=0;var uncaughtExceptionCount=0;var ___cxa_throw=(ptr,type,destructor)=>{var info=new ExceptionInfo(ptr);// Initialize ExceptionInfo content after it was allocated in __cxa_allocate_exception.
info.init(type,destructor);exceptionLast=ptr;uncaughtExceptionCount++;throw exceptionLast};var __Unwind_RaiseException=ex=>{err("Warning: _Unwind_RaiseException is not correctly implemented");return ___cxa_throw(ex,0,0)};var UTF8Decoder=globalThis.TextDecoder&&new TextDecoder;var findStringEnd=(heapOrArray,idx,maxBytesToRead,ignoreNul)=>{var maxIdx=idx+maxBytesToRead;if(ignoreNul)return maxIdx;// TextDecoder needs to know the byte length in advance, it doesn't stop on
// null terminator by itself.
// As a tiny code save trick, compare idx against maxIdx using a negation,
// so that maxBytesToRead=undefined/NaN means Infinity.
while(heapOrArray[idx]&&!(idx>=maxIdx))++idx;return idx};/**
     * Given a pointer 'idx' to a null-terminated UTF8-encoded string in the given
     * array that contains uint8 values, returns a copy of that string as a
     * Javascript String object.
     * heapOrArray is either a regular array, or a JavaScript typed array view.
     * @param {number=} idx
     * @param {number=} maxBytesToRead
     * @param {boolean=} ignoreNul - If true, the function will not stop on a NUL character.
     * @return {string}
     */var UTF8ArrayToString=(heapOrArray,idx=0,maxBytesToRead,ignoreNul)=>{var endPtr=findStringEnd(heapOrArray,idx,maxBytesToRead,ignoreNul);// When using conditional TextDecoder, skip it for short strings as the overhead of the native call is not worth it.
if(endPtr-idx>16&&heapOrArray.buffer&&UTF8Decoder){return UTF8Decoder.decode(heapOrArray.subarray(idx,endPtr))}var str="";while(idx<endPtr){// For UTF8 byte structure, see:
// http://en.wikipedia.org/wiki/UTF-8#Description
// https://www.ietf.org/rfc/rfc2279.txt
// https://tools.ietf.org/html/rfc3629
var u0=heapOrArray[idx++];if(!(u0&128)){str+=String.fromCharCode(u0);continue}var u1=heapOrArray[idx++]&63;if((u0&224)==192){str+=String.fromCharCode(((u0&31)<<6)|u1);continue}var u2=heapOrArray[idx++]&63;if((u0&240)==224){u0=((u0&15)<<12)|(u1<<6)|u2}else{u0=((u0&7)<<18)|(u1<<12)|(u2<<6)|(heapOrArray[idx++]&63)}if(u0<65536){str+=String.fromCharCode(u0)}else{var ch=u0-65536;str+=String.fromCharCode(55296|(ch>>10),56320|(ch&1023))}}return str};/**
     * Given a pointer 'ptr' to a null-terminated UTF8-encoded string in the
     * emscripten HEAP, returns a copy of that string as a Javascript String object.
     *
     * @param {number} ptr
     * @param {number=} maxBytesToRead - An optional length that specifies the
     *   maximum number of bytes to read. You can omit this parameter to scan the
     *   string until the first 0 byte. If maxBytesToRead is passed, and the string
     *   at [ptr, ptr+maxBytesToReadr[ contains a null byte in the middle, then the
     *   string will cut short at that byte index.
     * @param {boolean=} ignoreNul - If true, the function will not stop on a NUL character.
     * @return {string}
     */var UTF8ToString=(ptr,maxBytesToRead,ignoreNul)=>ptr?UTF8ArrayToString(HEAPU8,ptr,maxBytesToRead,ignoreNul):"";var SYSCALLS={varargs:undefined,getStr(ptr){var ret=UTF8ToString(ptr);return ret}};function ___syscall_fcntl64(fd,cmd,varargs){SYSCALLS.varargs=varargs;return 0}var ___syscall_fstat64=(fd,buf)=>{};var ___syscall_getcwd=(buf,size)=>{};var ___syscall_getdents64=(fd,dirp,count)=>{};function ___syscall_ioctl(fd,op,varargs){SYSCALLS.varargs=varargs;return 0}var ___syscall_lstat64=(path,buf)=>{};var ___syscall_mkdirat=(dirfd,path,mode)=>{};var ___syscall_newfstatat=(dirfd,path,buf,flags)=>{};function ___syscall_openat(dirfd,path,flags,varargs){SYSCALLS.varargs=varargs}var ___syscall_stat64=(path,buf)=>{};var __abort_js=()=>abort("");var AsciiToString=ptr=>{var str="";while(1){var ch=HEAPU8[ptr++];if(!ch)return str;str+=String.fromCharCode(ch)}};var awaitingDependencies={};var registeredTypes={};var typeDependencies={};var BindingError=class BindingError extends Error{constructor(message){super(message);this.name="BindingError"}};var throwBindingError=message=>{throw new BindingError(message)};/** @param {Object=} options */function sharedRegisterType(rawType,registeredInstance,options={}){var name=registeredInstance.name;if(!rawType){throwBindingError(`type "${name}" must have a positive integer typeid pointer`)}if(registeredTypes.hasOwnProperty(rawType)){if(options.ignoreDuplicateRegistrations){return}else{throwBindingError(`Cannot register type '${name}' twice`)}}registeredTypes[rawType]=registeredInstance;delete typeDependencies[rawType];if(awaitingDependencies.hasOwnProperty(rawType)){var callbacks=awaitingDependencies[rawType];delete awaitingDependencies[rawType];callbacks.forEach(cb=>cb())}}/** @param {Object=} options */function registerType(rawType,registeredInstance,options={}){return sharedRegisterType(rawType,registeredInstance,options)}var integerReadValueFromPointer=(name,width,signed)=>{// integers are quite common, so generate very specialized functions
switch(width){case 1:return signed?pointer=>HEAP8[pointer]:pointer=>HEAPU8[pointer];case 2:return signed?pointer=>HEAP16[((pointer)>>1)]:pointer=>HEAPU16[((pointer)>>1)];case 4:return signed?pointer=>HEAP32[((pointer)>>2)]:pointer=>HEAPU32[((pointer)>>2)];case 8:return signed?pointer=>HEAP64[((pointer)>>3)]:pointer=>HEAPU64[((pointer)>>3)];default:throw new TypeError(`invalid integer width (${width}): ${name}`)}};/** @suppress {globalThis} */var __embind_register_bigint=(primitiveType,name,size,minRange,maxRange)=>{name=AsciiToString(name);const isUnsignedType=minRange===0n;let fromWireType=value=>value;if(isUnsignedType){// uint64 get converted to int64 in ABI, fix them up like we do for 32-bit integers.
const bitSize=size*8;fromWireType=value=>BigInt.asUintN(bitSize,value);maxRange=fromWireType(maxRange)}registerType(primitiveType,{name,fromWireType,toWireType:(destructors,value)=>{if(typeof value=="number"){value=BigInt(value)}return value},readValueFromPointer:integerReadValueFromPointer(name,size,!isUnsignedType),destructorFunction:null})};/** @suppress {globalThis} */var __embind_register_bool=(rawType,name,trueValue,falseValue)=>{name=AsciiToString(name);registerType(rawType,{name,fromWireType:function(wt){// ambiguous emscripten ABI: sometimes return values are
// true or false, and sometimes integers (0 or 1)
return!!wt},toWireType:function(destructors,o){return o?trueValue:falseValue},readValueFromPointer:function(pointer){return this.fromWireType(HEAPU8[pointer])},destructorFunction:null})};var emval_freelist=[];var emval_handles=[0,1,,1,null,1,true,1,false,1];var __emval_decref=handle=>{if(handle>9&&0===--emval_handles[handle+1]){emval_handles[handle]=undefined;emval_freelist.push(handle)}};var Emval={toValue:handle=>{if(!handle){throwBindingError(`Cannot use deleted val. handle = ${handle}`)}return emval_handles[handle]},toHandle:value=>{switch(value){case undefined:return 2;case null:return 4;case true:return 6;case false:return 8;default:{const handle=emval_freelist.pop()||emval_handles.length;emval_handles[handle]=value;emval_handles[handle+1]=1;return handle}}}};/** @suppress {globalThis} */function readPointer(pointer){return this.fromWireType(HEAPU32[((pointer)>>2)])}var EmValType={name:"emscripten::val",fromWireType:handle=>{var rv=Emval.toValue(handle);__emval_decref(handle);return rv},toWireType:(destructors,value)=>Emval.toHandle(value),readValueFromPointer:readPointer,destructorFunction:null};var __embind_register_emval=rawType=>registerType(rawType,EmValType);var floatReadValueFromPointer=(name,width)=>{switch(width){case 4:return function(pointer){return this.fromWireType(HEAPF32[((pointer)>>2)])};case 8:return function(pointer){return this.fromWireType(HEAPF64[((pointer)>>3)])};default:throw new TypeError(`invalid float width (${width}): ${name}`)}};var __embind_register_float=(rawType,name,size)=>{name=AsciiToString(name);registerType(rawType,{name,fromWireType:value=>value,toWireType:(destructors,value)=>value,readValueFromPointer:floatReadValueFromPointer(name,size),destructorFunction:null})};var createNamedFunction=(name,func)=>Object.defineProperty(func,"name",{value:name});var runDestructors=destructors=>{while(destructors.length){var ptr=destructors.pop();var del=destructors.pop();del(ptr)}};function usesDestructorStack(argTypes){// Skip return value at index 0 - it's not deleted here.
for(var i=1;i<argTypes.length;++i){// The type does not define a destructor function - must use dynamic stack
if(argTypes[i]!==null&&argTypes[i].destructorFunction===undefined){return true}}return false}var InvokerFunctions={"ftf":function anonymous(humanName,throwBindingError,invoker,fn,runDestructors,fromRetWire,toClassParamWire){return function(){var rv=invoker(fn);var ret=fromRetWire(rv);return ret}},"ftftt":function anonymous(humanName,throwBindingError,invoker,fn,runDestructors,fromRetWire,toClassParamWire,toArg0Wire,toArg1Wire,arg0Wired_dtor,arg1Wired_dtor){return function(arg0,arg1){var arg0Wired=toArg0Wire(null,arg0);var arg1Wired=toArg1Wire(null,arg1);var rv=invoker(fn,arg0Wired,arg1Wired);arg0Wired_dtor(arg0Wired);arg1Wired_dtor(arg1Wired);var ret=fromRetWire(rv);return ret}},"ftfn":function anonymous(humanName,throwBindingError,invoker,fn,runDestructors,fromRetWire,toClassParamWire,toArg0Wire){return function(arg0){var arg0Wired=toArg0Wire(null,arg0);var rv=invoker(fn,arg0Wired);var ret=fromRetWire(rv);return ret}},"ffft":function anonymous(humanName,throwBindingError,invoker,fn,runDestructors,fromRetWire,toClassParamWire,toArg0Wire,arg0Wired_dtor){return function(arg0){var arg0Wired=toArg0Wire(null,arg0);invoker(fn,arg0Wired);arg0Wired_dtor(arg0Wired)}},"ffftnnn":function anonymous(humanName,throwBindingError,invoker,fn,runDestructors,fromRetWire,toClassParamWire,toArg0Wire,toArg1Wire,toArg2Wire,toArg3Wire,arg0Wired_dtor){return function(arg0,arg1,arg2,arg3){var arg0Wired=toArg0Wire(null,arg0);var arg1Wired=toArg1Wire(null,arg1);var arg2Wired=toArg2Wire(null,arg2);var arg3Wired=toArg3Wire(null,arg3);invoker(fn,arg0Wired,arg1Wired,arg2Wired,arg3Wired);arg0Wired_dtor(arg0Wired)}},"ffftnnnn":function anonymous(humanName,throwBindingError,invoker,fn,runDestructors,fromRetWire,toClassParamWire,toArg0Wire,toArg1Wire,toArg2Wire,toArg3Wire,toArg4Wire,arg0Wired_dtor){return function(arg0,arg1,arg2,arg3,arg4){var arg0Wired=toArg0Wire(null,arg0);var arg1Wired=toArg1Wire(null,arg1);var arg2Wired=toArg2Wire(null,arg2);var arg3Wired=toArg3Wire(null,arg3);var arg4Wired=toArg4Wire(null,arg4);invoker(fn,arg0Wired,arg1Wired,arg2Wired,arg3Wired,arg4Wired);arg0Wired_dtor(arg0Wired)}},"fffttn":function anonymous(humanName,throwBindingError,invoker,fn,runDestructors,fromRetWire,toClassParamWire,toArg0Wire,toArg1Wire,toArg2Wire,arg0Wired_dtor,arg1Wired_dtor){return function(arg0,arg1,arg2){var arg0Wired=toArg0Wire(null,arg0);var arg1Wired=toArg1Wire(null,arg1);var arg2Wired=toArg2Wire(null,arg2);invoker(fn,arg0Wired,arg1Wired,arg2Wired);arg0Wired_dtor(arg0Wired);arg1Wired_dtor(arg1Wired)}},"ftfttt":function anonymous(humanName,throwBindingError,invoker,fn,runDestructors,fromRetWire,toClassParamWire,toArg0Wire,toArg1Wire,toArg2Wire,arg0Wired_dtor,arg1Wired_dtor,arg2Wired_dtor){return function(arg0,arg1,arg2){var arg0Wired=toArg0Wire(null,arg0);var arg1Wired=toArg1Wire(null,arg1);var arg2Wired=toArg2Wire(null,arg2);var rv=invoker(fn,arg0Wired,arg1Wired,arg2Wired);arg0Wired_dtor(arg0Wired);arg1Wired_dtor(arg1Wired);arg2Wired_dtor(arg2Wired);var ret=fromRetWire(rv);return ret}},"fff":function anonymous(humanName,throwBindingError,invoker,fn,runDestructors,fromRetWire,toClassParamWire){return function(){invoker(fn)}},"fffn":function anonymous(humanName,throwBindingError,invoker,fn,runDestructors,fromRetWire,toClassParamWire,toArg0Wire){return function(arg0){var arg0Wired=toArg0Wire(null,arg0);invoker(fn,arg0Wired)}}};function createJsInvokerSignature(argTypes,isClassMethodFunc,returns,isAsync){const signature=[isClassMethodFunc?"t":"f",returns?"t":"f",isAsync?"t":"f"];for(let i=isClassMethodFunc?1:2;i<argTypes.length;++i){const arg=argTypes[i];let destructorSig="";if(arg.destructorFunction===undefined){destructorSig="u"}else if(arg.destructorFunction===null){destructorSig="n"}else{destructorSig="t"}signature.push(destructorSig)}return signature.join("")}function craftInvokerFunction(humanName,argTypes,classType,cppInvokerFunc,cppTargetFunc,/** boolean= */isAsync){// humanName: a human-readable string name for the function to be generated.
// argTypes: An array that contains the embind type objects for all types in the function signature.
//    argTypes[0] is the type object for the function return value.
//    argTypes[1] is the type object for function this object/class type, or null if not crafting an invoker for a class method.
//    argTypes[2...] are the actual function parameters.
// classType: The embind type object for the class to be bound, or null if this is not a method of a class.
// cppInvokerFunc: JS Function object to the C++-side function that interops into C++ code.
// cppTargetFunc: Function pointer (an integer to FUNCTION_TABLE) to the target C++ function the cppInvokerFunc will end up calling.
// isAsync: Optional. If true, returns an async function. Async bindings are only supported with JSPI.
var argCount=argTypes.length;if(argCount<2){throwBindingError("argTypes array size mismatch! Must at least get return value and 'this' types!")}var isClassMethodFunc=(argTypes[1]!==null&&classType!==null);// Free functions with signature "void function()" do not need an invoker that marshalls between wire types.
// TODO: This omits argument count check - enable only at -O3 or similar.
//    if (ENABLE_UNSAFE_OPTS && argCount == 2 && argTypes[0].name == "void" && !isClassMethodFunc) {
//       return FUNCTION_TABLE[fn];
//    }
// Determine if we need to use a dynamic stack to store the destructors for the function parameters.
// TODO: Remove this completely once all function invokers are being dynamically generated.
var needsDestructorStack=usesDestructorStack(argTypes);var returns=!argTypes[0].isVoid;// Builld the arguments that will be passed into the closure around the invoker
// function.
var retType=argTypes[0];var instType=argTypes[1];var closureArgs=[humanName,throwBindingError,cppInvokerFunc,cppTargetFunc,runDestructors,retType.fromWireType.bind(retType),instType?.toWireType.bind(instType)];for(var i=2;i<argCount;++i){var argType=argTypes[i];closureArgs.push(argType.toWireType.bind(argType))}if(!needsDestructorStack){// Skip return value at index 0 - it's not deleted here. Also skip class type if not a method.
for(var i=isClassMethodFunc?1:2;i<argTypes.length;++i){if(argTypes[i].destructorFunction!==null){closureArgs.push(argTypes[i].destructorFunction)}}}var signature=createJsInvokerSignature(argTypes,isClassMethodFunc,returns,isAsync);var invokerFn=InvokerFunctions[signature](...closureArgs);return createNamedFunction(humanName,invokerFn)}var ensureOverloadTable=(proto,methodName,humanName)=>{if(undefined===proto[methodName].overloadTable){var prevFunc=proto[methodName];// Inject an overload resolver function that routes to the appropriate overload based on the number of arguments.
proto[methodName]=function(...args){// TODO This check can be removed in -O3 level "unsafe" optimizations.
if(!proto[methodName].overloadTable.hasOwnProperty(args.length)){throwBindingError(`Function '${humanName}' called with an invalid number of arguments (${args.length}) - expects one of (${proto[methodName].overloadTable})!`)}return proto[methodName].overloadTable[args.length].apply(this,args)};// Move the previous function into the overload table.
proto[methodName].overloadTable=[];proto[methodName].overloadTable[prevFunc.argCount]=prevFunc}};/** @param {number=} numArguments */var exposePublicSymbol=(name,value,numArguments)=>{if(Module.hasOwnProperty(name)){if(undefined===numArguments||(undefined!==Module[name].overloadTable&&undefined!==Module[name].overloadTable[numArguments])){throwBindingError(`Cannot register public name '${name}' twice`)}// We are exposing a function with the same name as an existing function. Create an overload table and a function selector
// that routes between the two.
ensureOverloadTable(Module,name,name);if(Module[name].overloadTable.hasOwnProperty(numArguments)){throwBindingError(`Cannot register multiple overloads of a function with the same number of arguments (${numArguments})!`)}// Add the new function into the overload table.
Module[name].overloadTable[numArguments]=value}else{Module[name]=value;Module[name].argCount=numArguments}};var heap32VectorToArray=(count,firstElement)=>{var array=[];for(var i=0;i<count;i++){// TODO(https://github.com/emscripten-core/emscripten/issues/17310):
// Find a way to hoist the `>> 2` or `>> 3` out of this loop.
array.push(HEAPU32[(((firstElement)+(i*4))>>2)])}return array};var InternalError=class InternalError extends Error{constructor(message){super(message);this.name="InternalError"}};var throwInternalError=message=>{throw new InternalError(message)};/** @param {number=} numArguments */var replacePublicSymbol=(name,value,numArguments)=>{if(!Module.hasOwnProperty(name)){throwInternalError("Replacing nonexistent public symbol")}// If there's an overload table for this symbol, replace the symbol in the overload table instead.
if(undefined!==Module[name].overloadTable&&undefined!==numArguments){Module[name].overloadTable[numArguments]=value}else{Module[name]=value;Module[name].argCount=numArguments}};/** @suppress{checkTypes} */var getWasmTableEntry=funcPtr=>wasmTable.get(funcPtr);var embind__requireFunction=(signature,rawFunction,isAsync=false)=>{signature=AsciiToString(signature);function makeDynCaller(){var rtn=getWasmTableEntry(rawFunction);return rtn}var fp=makeDynCaller();if(typeof fp!="function"){throwBindingError(`unknown function pointer with signature ${signature}: ${rawFunction}`)}return fp};class UnboundTypeError extends Error{}var getTypeName=type=>{var ptr=___getTypeName(type);var rv=AsciiToString(ptr);_free(ptr);return rv};var throwUnboundTypeError=(message,types)=>{var unboundTypes=[];var seen={};function visit(type){if(seen[type]){return}if(registeredTypes[type]){return}if(typeDependencies[type]){typeDependencies[type].forEach(visit);return}unboundTypes.push(type);seen[type]=true}types.forEach(visit);throw new UnboundTypeError(`${message}: `+unboundTypes.map(getTypeName).join([", "]))};var whenDependentTypesAreResolved=(myTypes,dependentTypes,getTypeConverters)=>{myTypes.forEach(type=>typeDependencies[type]=dependentTypes);function onComplete(typeConverters){var myTypeConverters=getTypeConverters(typeConverters);if(myTypeConverters.length!==myTypes.length){throwInternalError("Mismatched type converter count")}for(var i=0;i<myTypes.length;++i){registerType(myTypes[i],myTypeConverters[i])}}var typeConverters=new Array(dependentTypes.length);var unregisteredTypes=[];var registered=0;dependentTypes.forEach((dt,i)=>{if(registeredTypes.hasOwnProperty(dt)){typeConverters[i]=registeredTypes[dt]}else{unregisteredTypes.push(dt);if(!awaitingDependencies.hasOwnProperty(dt)){awaitingDependencies[dt]=[]}awaitingDependencies[dt].push(()=>{typeConverters[i]=registeredTypes[dt];++registered;if(registered===unregisteredTypes.length){onComplete(typeConverters)}})}});if(0===unregisteredTypes.length){onComplete(typeConverters)}};var getFunctionName=signature=>{signature=signature.trim();const argsIndex=signature.indexOf("(");if(argsIndex===-1)return signature;return signature.slice(0,argsIndex)};var __embind_register_function=(name,argCount,rawArgTypesAddr,signature,rawInvoker,fn,isAsync,isNonnullReturn)=>{var argTypes=heap32VectorToArray(argCount,rawArgTypesAddr);name=AsciiToString(name);name=getFunctionName(name);rawInvoker=embind__requireFunction(signature,rawInvoker,isAsync);exposePublicSymbol(name,function(){throwUnboundTypeError(`Cannot call ${name} due to unbound types`,argTypes)},argCount-1);whenDependentTypesAreResolved([],argTypes,argTypes=>{var invokerArgsArray=[argTypes[0],null].concat(argTypes.slice(1));replacePublicSymbol(name,craftInvokerFunction(name,invokerArgsArray,null,rawInvoker,fn,isAsync),argCount-1);return[]})};/** @suppress {globalThis} */var __embind_register_integer=(primitiveType,name,size,minRange,maxRange)=>{name=AsciiToString(name);const isUnsignedType=minRange===0;let fromWireType=value=>value;if(isUnsignedType){var bitshift=32-8*size;fromWireType=value=>(value<<bitshift)>>>bitshift;maxRange=fromWireType(maxRange)}registerType(primitiveType,{name,fromWireType,toWireType:(destructors,value)=>value,readValueFromPointer:integerReadValueFromPointer(name,size,minRange!==0),destructorFunction:null})};var __embind_register_memory_view=(rawType,dataTypeIndex,name)=>{var typeMapping=[Int8Array,Uint8Array,Int16Array,Uint16Array,Int32Array,Uint32Array,Float32Array,Float64Array,BigInt64Array,BigUint64Array];var TA=typeMapping[dataTypeIndex];function decodeMemoryView(handle){var size=HEAPU32[((handle)>>2)];var data=HEAPU32[(((handle)+(4))>>2)];return new TA(HEAP8.buffer,data,size)}name=AsciiToString(name);registerType(rawType,{name,fromWireType:decodeMemoryView,readValueFromPointer:decodeMemoryView},{ignoreDuplicateRegistrations:true})};var stringToUTF8Array=(str,heap,outIdx,maxBytesToWrite)=>{// Parameter maxBytesToWrite is not optional. Negative values, 0, null,
// undefined and false each don't write out any bytes.
if(!(maxBytesToWrite>0))return 0;var startIdx=outIdx;var endIdx=outIdx+maxBytesToWrite-1;// -1 for string null terminator.
for(var i=0;i<str.length;++i){// For UTF8 byte structure, see http://en.wikipedia.org/wiki/UTF-8#Description
// and https://www.ietf.org/rfc/rfc2279.txt
// and https://tools.ietf.org/html/rfc3629
var u=str.codePointAt(i);if(u<=127){if(outIdx>=endIdx)break;heap[outIdx++]=u}else if(u<=2047){if(outIdx+1>=endIdx)break;heap[outIdx++]=192|(u>>6);heap[outIdx++]=128|(u&63)}else if(u<=65535){if(outIdx+2>=endIdx)break;heap[outIdx++]=224|(u>>12);heap[outIdx++]=128|((u>>6)&63);heap[outIdx++]=128|(u&63)}else{if(outIdx+3>=endIdx)break;heap[outIdx++]=240|(u>>18);heap[outIdx++]=128|((u>>12)&63);heap[outIdx++]=128|((u>>6)&63);heap[outIdx++]=128|(u&63);// Gotcha: if codePoint is over 0xFFFF, it is represented as a surrogate pair in UTF-16.
// We need to manually skip over the second code unit for correct iteration.
i++}}// Null-terminate the pointer to the buffer.
heap[outIdx]=0;return outIdx-startIdx};var stringToUTF8=(str,outPtr,maxBytesToWrite)=>stringToUTF8Array(str,HEAPU8,outPtr,maxBytesToWrite);var lengthBytesUTF8=str=>{var len=0;for(var i=0;i<str.length;++i){// Gotcha: charCodeAt returns a 16-bit word that is a UTF-16 encoded code
// unit, not a Unicode code point of the character! So decode
// UTF16->UTF32->UTF8.
// See http://unicode.org/faq/utf_bom.html#utf16-3
var c=str.charCodeAt(i);// possibly a lead surrogate
if(c<=127){len++}else if(c<=2047){len+=2}else if(c>=55296&&c<=57343){len+=4;++i}else{len+=3}}return len};var __embind_register_std_string=(rawType,name)=>{name=AsciiToString(name);var stdStringIsUTF8=true;registerType(rawType,{name,// For some method names we use string keys here since they are part of
// the public/external API and/or used by the runtime-generated code.
fromWireType(value){var length=HEAPU32[((value)>>2)];var payload=value+4;var str;if(stdStringIsUTF8){str=UTF8ToString(payload,length,true)}else{str="";for(var i=0;i<length;++i){str+=String.fromCharCode(HEAPU8[payload+i])}}_free(value);return str},toWireType(destructors,value){if(value instanceof ArrayBuffer){value=new Uint8Array(value)}var length;var valueIsOfTypeString=(typeof value=="string");// We accept `string` or array views with single byte elements
if(!(valueIsOfTypeString||(ArrayBuffer.isView(value)&&value.BYTES_PER_ELEMENT==1))){throwBindingError("Cannot pass non-string to std::string")}if(stdStringIsUTF8&&valueIsOfTypeString){length=lengthBytesUTF8(value)}else{length=value.length}// assumes POINTER_SIZE alignment
var base=_malloc(4+length+1);var ptr=base+4;HEAPU32[((base)>>2)]=length;if(valueIsOfTypeString){if(stdStringIsUTF8){stringToUTF8(value,ptr,length+1)}else{for(var i=0;i<length;++i){var charCode=value.charCodeAt(i);if(charCode>255){_free(base);throwBindingError("String has UTF-16 code units that do not fit in 8 bits")}HEAPU8[ptr+i]=charCode}}}else{HEAPU8.set(value,ptr)}if(destructors!==null){destructors.push(_free,base)}return base},readValueFromPointer:readPointer,destructorFunction(ptr){_free(ptr)}})};var UTF16Decoder=globalThis.TextDecoder?new TextDecoder("utf-16le"):undefined;var UTF16ToString=(ptr,maxBytesToRead,ignoreNul)=>{var idx=((ptr)>>1);var endIdx=findStringEnd(HEAPU16,idx,maxBytesToRead/2,ignoreNul);// When using conditional TextDecoder, skip it for short strings as the overhead of the native call is not worth it.
if(endIdx-idx>16&&UTF16Decoder)return UTF16Decoder.decode(HEAPU16.subarray(idx,endIdx));// Fallback: decode without UTF16Decoder
var str="";// If maxBytesToRead is not passed explicitly, it will be undefined, and the
// for-loop's condition will always evaluate to true. The loop is then
// terminated on the first null char.
for(var i=idx;i<endIdx;++i){var codeUnit=HEAPU16[i];// fromCharCode constructs a character from a UTF-16 code unit, so we can
// pass the UTF16 string right through.
str+=String.fromCharCode(codeUnit)}return str};var stringToUTF16=(str,outPtr,maxBytesToWrite)=>{// Backwards compatibility: if max bytes is not specified, assume unsafe unbounded write is allowed.
maxBytesToWrite??=2147483647;if(maxBytesToWrite<2)return 0;maxBytesToWrite-=2;// Null terminator.
var startPtr=outPtr;var numCharsToWrite=(maxBytesToWrite<str.length*2)?(maxBytesToWrite/2):str.length;for(var i=0;i<numCharsToWrite;++i){// charCodeAt returns a UTF-16 encoded code unit, so it can be directly written to the HEAP.
var codeUnit=str.charCodeAt(i);// possibly a lead surrogate
HEAP16[((outPtr)>>1)]=codeUnit;outPtr+=2}// Null-terminate the pointer to the HEAP.
HEAP16[((outPtr)>>1)]=0;return outPtr-startPtr};var lengthBytesUTF16=str=>str.length*2;var UTF32ToString=(ptr,maxBytesToRead,ignoreNul)=>{var str="";var startIdx=((ptr)>>2);// If maxBytesToRead is not passed explicitly, it will be undefined, and this
// will always evaluate to true. This saves on code size.
for(var i=0;!(i>=maxBytesToRead/4);i++){var utf32=HEAPU32[startIdx+i];if(!utf32&&!ignoreNul)break;str+=String.fromCodePoint(utf32)}return str};var stringToUTF32=(str,outPtr,maxBytesToWrite)=>{// Backwards compatibility: if max bytes is not specified, assume unsafe unbounded write is allowed.
maxBytesToWrite??=2147483647;if(maxBytesToWrite<4)return 0;var startPtr=outPtr;var endPtr=startPtr+maxBytesToWrite-4;for(var i=0;i<str.length;++i){var codePoint=str.codePointAt(i);// Gotcha: if codePoint is over 0xFFFF, it is represented as a surrogate pair in UTF-16.
// We need to manually skip over the second code unit for correct iteration.
if(codePoint>65535){i++}HEAP32[((outPtr)>>2)]=codePoint;outPtr+=4;if(outPtr+4>endPtr)break}// Null-terminate the pointer to the HEAP.
HEAP32[((outPtr)>>2)]=0;return outPtr-startPtr};var lengthBytesUTF32=str=>{var len=0;for(var i=0;i<str.length;++i){var codePoint=str.codePointAt(i);// Gotcha: if codePoint is over 0xFFFF, it is represented as a surrogate pair in UTF-16.
// We need to manually skip over the second code unit for correct iteration.
if(codePoint>65535){i++}len+=4}return len};var __embind_register_std_wstring=(rawType,charSize,name)=>{name=AsciiToString(name);var decodeString,encodeString,lengthBytesUTF;if(charSize===2){decodeString=UTF16ToString;encodeString=stringToUTF16;lengthBytesUTF=lengthBytesUTF16}else{decodeString=UTF32ToString;encodeString=stringToUTF32;lengthBytesUTF=lengthBytesUTF32}registerType(rawType,{name,fromWireType:value=>{// Code mostly taken from _embind_register_std_string fromWireType
var length=HEAPU32[((value)>>2)];var str=decodeString(value+4,length*charSize,true);_free(value);return str},toWireType:(destructors,value)=>{if(!(typeof value=="string")){throwBindingError(`Cannot pass non-string to C++ string type ${name}`)}// assumes POINTER_SIZE alignment
var length=lengthBytesUTF(value);var ptr=_malloc(4+length+charSize);HEAPU32[((ptr)>>2)]=length/charSize;encodeString(value,ptr+4,length+charSize);if(destructors!==null){destructors.push(_free,ptr)}return ptr},readValueFromPointer:readPointer,destructorFunction(ptr){_free(ptr)}})};var __embind_register_void=(rawType,name)=>{name=AsciiToString(name);registerType(rawType,{isVoid:true,// void return values can be optimized out sometimes
name,fromWireType:()=>undefined,// TODO: assert if anything else is given?
toWireType:(destructors,o)=>undefined})};var emval_methodCallers=[];var emval_addMethodCaller=caller=>{var id=emval_methodCallers.length;emval_methodCallers.push(caller);return id};var requireRegisteredType=(rawType,humanName)=>{var impl=registeredTypes[rawType];if(undefined===impl){throwBindingError(`${humanName} has unknown type ${getTypeName(rawType)}`)}return impl};var emval_lookupTypes=(argCount,argTypes)=>{var a=new Array(argCount);for(var i=0;i<argCount;++i){a[i]=requireRegisteredType(HEAPU32[(((argTypes)+(i*4))>>2)],`parameter ${i}`)}return a};var emval_returnValue=(toReturnWire,destructorsRef,handle)=>{var destructors=[];var result=toReturnWire(destructors,handle);if(destructors.length){// void, primitives and any other types w/o destructors don't need to allocate a handle
HEAPU32[((destructorsRef)>>2)]=Emval.toHandle(destructors)}return result};var emval_symbols={};var getStringOrSymbol=address=>{var symbol=emval_symbols[address];if(symbol===undefined){return AsciiToString(address)}return symbol};var __emval_create_invoker=(argCount,argTypesPtr,kind)=>{var GenericWireTypeSize=8;var[retType,...argTypes]=emval_lookupTypes(argCount,argTypesPtr);var toReturnWire=retType.toWireType.bind(retType);var argFromPtr=argTypes.map(type=>type.readValueFromPointer.bind(type));argCount--;// remove the extracted return type
var argN=new Array(argCount);var invokerFunction=(handle,methodName,destructorsRef,args)=>{var offset=0;for(var i=0;i<argCount;++i){argN[i]=argFromPtr[i](args+offset);offset+=GenericWireTypeSize}var rv;switch(kind){case 0:rv=Emval.toValue(handle).apply(null,argN);break;case 2:rv=Reflect.construct(Emval.toValue(handle),argN);break;case 3:// no-op, just return the argument
rv=argN[0];break;case 1:rv=Emval.toValue(handle)[getStringOrSymbol(methodName)](...argN);break}return emval_returnValue(toReturnWire,destructorsRef,rv)};var functionName=`methodCaller<(${argTypes.map(t=>t.name)}) => ${retType.name}>`;return emval_addMethodCaller(createNamedFunction(functionName,invokerFunction))};var __emval_get_global=name=>{if(!name){return Emval.toHandle(globalThis)}name=getStringOrSymbol(name);return Emval.toHandle(globalThis[name])};var __emval_get_property=(handle,key)=>{handle=Emval.toValue(handle);key=Emval.toValue(key);return Emval.toHandle(handle[key])};var __emval_incref=handle=>{if(handle>9){emval_handles[handle+1]+=1}};var __emval_instanceof=(object,constructor)=>{object=Emval.toValue(object);constructor=Emval.toValue(constructor);return object instanceof constructor};var __emval_invoke=(caller,handle,methodName,destructorsRef,args)=>emval_methodCallers[caller](handle,methodName,destructorsRef,args);var __emval_is_number=handle=>{handle=Emval.toValue(handle);return typeof handle=="number"};var __emval_is_string=handle=>{handle=Emval.toValue(handle);return typeof handle=="string"};var __emval_new_array=()=>Emval.toHandle([]);var __emval_new_cstring=v=>Emval.toHandle(getStringOrSymbol(v));var __emval_new_object=()=>Emval.toHandle({});var __emval_new_u8string=v=>Emval.toHandle(UTF8ToString(v));var __emval_run_destructors=handle=>{var destructors=Emval.toValue(handle);runDestructors(destructors);__emval_decref(handle)};var __emval_set_property=(handle,key,value)=>{handle=Emval.toValue(handle);key=Emval.toValue(key);value=Emval.toValue(value);handle[key]=value};var __emval_typeof=handle=>{handle=Emval.toValue(handle);return Emval.toHandle(typeof handle)};var INT53_MAX=9007199254740992;var INT53_MIN=-9007199254740992;var bigintToI53Checked=num=>(num<INT53_MIN||num>INT53_MAX)?NaN:Number(num);function __gmtime_js(time,tmPtr){time=bigintToI53Checked(time);var date=new Date(time*1e3);HEAP32[((tmPtr)>>2)]=date.getUTCSeconds();HEAP32[(((tmPtr)+(4))>>2)]=date.getUTCMinutes();HEAP32[(((tmPtr)+(8))>>2)]=date.getUTCHours();HEAP32[(((tmPtr)+(12))>>2)]=date.getUTCDate();HEAP32[(((tmPtr)+(16))>>2)]=date.getUTCMonth();HEAP32[(((tmPtr)+(20))>>2)]=date.getUTCFullYear()-1900;HEAP32[(((tmPtr)+(24))>>2)]=date.getUTCDay();var start=Date.UTC(date.getUTCFullYear(),0,1,0,0,0,0);var yday=((date.getTime()-start)/(1e3*60*60*24))|0;HEAP32[(((tmPtr)+(28))>>2)]=yday}function __mmap_js(len,prot,flags,fd,offset,allocated,addr){offset=bigintToI53Checked(offset);return-52}function __munmap_js(addr,len,prot,flags,fd,offset){offset=bigintToI53Checked(offset)}var __tzset_js=(timezone,daylight,std_name,dst_name)=>{// TODO: Use (malleable) environment variables instead of system settings.
var currentYear=(new Date).getFullYear();var winter=new Date(currentYear,0,1);var summer=new Date(currentYear,6,1);var winterOffset=winter.getTimezoneOffset();var summerOffset=summer.getTimezoneOffset();// Local standard timezone offset. Local standard time is not adjusted for
// daylight savings.  This code uses the fact that getTimezoneOffset returns
// a greater value during Standard Time versus Daylight Saving Time (DST).
// Thus it determines the expected output during Standard Time, and it
// compares whether the output of the given date the same (Standard) or less
// (DST).
var stdTimezoneOffset=Math.max(winterOffset,summerOffset);// timezone is specified as seconds west of UTC ("The external variable
// `timezone` shall be set to the difference, in seconds, between
// Coordinated Universal Time (UTC) and local standard time."), the same
// as returned by stdTimezoneOffset.
// See http://pubs.opengroup.org/onlinepubs/009695399/functions/tzset.html
HEAPU32[((timezone)>>2)]=stdTimezoneOffset*60;HEAP32[((daylight)>>2)]=Number(winterOffset!=summerOffset);var extractZone=timezoneOffset=>{// Why inverse sign?
// Read here https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getTimezoneOffset
var sign=timezoneOffset>=0?"-":"+";var absOffset=Math.abs(timezoneOffset);var hours=String(Math.floor(absOffset/60)).padStart(2,"0");var minutes=String(absOffset%60).padStart(2,"0");return`UTC${sign}${hours}${minutes}`};var winterName=extractZone(winterOffset);var summerName=extractZone(summerOffset);if(summerOffset<winterOffset){// Northern hemisphere
stringToUTF8(winterName,std_name,17);stringToUTF8(summerName,dst_name,17)}else{stringToUTF8(winterName,dst_name,17);stringToUTF8(summerName,std_name,17)}};var _emscripten_get_now=()=>Date.now();var _emscripten_date_now=()=>Date.now();var nowIsMonotonic=1;var checkWasiClock=clock_id=>clock_id>=0&&clock_id<=3;function _clock_time_get(clk_id,ignored_precision,ptime){ignored_precision=bigintToI53Checked(ignored_precision);if(!checkWasiClock(clk_id)){return 28}var now;// all wasi clocks but realtime are monotonic
if(clk_id===0){now=_emscripten_date_now()}else if(nowIsMonotonic){now=_emscripten_get_now()}else{return 52}// "now" is in ms, and wasi times are in ns.
var nsec=Math.round(now*1e3*1e3);HEAP64[((ptime)>>3)]=BigInt(nsec);return 0}var getHeapMax=()=>HEAPU8.length;var _emscripten_get_heap_max=()=>getHeapMax();var abortOnCannotGrowMemory=requestedSize=>{abort("OOM")};var _emscripten_resize_heap=requestedSize=>{var oldSize=HEAPU8.length;// With CAN_ADDRESS_2GB or MEMORY64, pointers are already unsigned.
requestedSize>>>=0;abortOnCannotGrowMemory(requestedSize)};var ENV={};var getExecutableName=()=>thisProgram||"./this.program";var getEnvStrings=()=>{if(!getEnvStrings.strings){// Default values.
// Browser language detection #8751
var lang=((typeof navigator=="object"&&navigator.language)||"C").replace("-","_")+".UTF-8";var env={"USER":"web_user","LOGNAME":"web_user","PATH":"/","PWD":"/","HOME":"/home/web_user","LANG":lang,"_":getExecutableName()};// Apply the user-provided values, if any.
for(var x in ENV){// x is a key in ENV; if ENV[x] is undefined, that means it was
// explicitly set to be so. We allow user code to do that to
// force variables with default values to remain unset.
if(ENV[x]===undefined)delete env[x];else env[x]=ENV[x]}var strings=[];for(var x in env){strings.push(`${x}=${env[x]}`)}getEnvStrings.strings=strings}return getEnvStrings.strings};var _environ_get=(__environ,environ_buf)=>{var bufSize=0;var envp=0;for(var string of getEnvStrings()){var ptr=environ_buf+bufSize;HEAPU32[(((__environ)+(envp))>>2)]=ptr;bufSize+=stringToUTF8(string,ptr,Infinity)+1;envp+=4}return 0};var _environ_sizes_get=(penviron_count,penviron_buf_size)=>{var strings=getEnvStrings();HEAPU32[((penviron_count)>>2)]=strings.length;var bufSize=0;for(var string of strings){bufSize+=lengthBytesUTF8(string)+1}HEAPU32[((penviron_buf_size)>>2)]=bufSize;return 0};var _fd_close=fd=>52;var _fd_read=(fd,iov,iovcnt,pnum)=>52;function _fd_seek(fd,offset,whence,newOffset){offset=bigintToI53Checked(offset);return 70}var printCharBuffers=[null,[],[]];var printChar=(stream,curr)=>{var buffer=printCharBuffers[stream];if(curr===0||curr===10){(stream===1?out:err)(UTF8ArrayToString(buffer));buffer.length=0}else{buffer.push(curr)}};var _fd_write=(fd,iov,iovcnt,pnum)=>{// hack to support printf in SYSCALLS_REQUIRE_FILESYSTEM=0
var num=0;for(var i=0;i<iovcnt;i++){var ptr=HEAPU32[((iov)>>2)];var len=HEAPU32[(((iov)+(4))>>2)];iov+=8;for(var j=0;j<len;j++){printChar(fd,HEAPU8[ptr+j])}num+=len}HEAPU32[((pnum)>>2)]=num;return 0};var initRandomFill=()=>view=>view;var randomFill=view=>{// Lazily init on the first invocation.
(randomFill=initRandomFill())(view)};var _random_get=(buffer,size)=>{randomFill(HEAPU8.subarray(buffer,buffer+size));return 0};// End JS library code
// include: postlibrary.js
// This file is included after the automatically-generated JS library code
// but before the wasm module is created.
{}// Begin runtime exports
// End runtime exports
// Begin JS library exports
// End JS library exports
// end include: postlibrary.js
// Imports from the Wasm binary.
var ___getTypeName,_free,_malloc,memory,__indirect_function_table,wasmMemory,wasmTable;function assignWasmExports(wasmExports){___getTypeName=wasmExports["da"];_free=Module["_free"]=wasmExports["fa"];_malloc=Module["_malloc"]=wasmExports["ga"];memory=wasmMemory=wasmExports["ba"];__indirect_function_table=wasmTable=wasmExports["ea"]}var wasmImports={/** @export */U:__Unwind_RaiseException,/** @export */d:___cxa_throw,/** @export */u:___syscall_fcntl64,/** @export */R:___syscall_fstat64,/** @export */N:___syscall_getcwd,/** @export */E:___syscall_getdents64,/** @export */q:___syscall_ioctl,/** @export */O:___syscall_lstat64,/** @export */B:___syscall_mkdirat,/** @export */P:___syscall_newfstatat,/** @export */v:___syscall_openat,/** @export */Q:___syscall_stat64,/** @export */T:__abort_js,/** @export */y:__embind_register_bigint,/** @export */X:__embind_register_bool,/** @export */V:__embind_register_emval,/** @export */x:__embind_register_float,/** @export */i:__embind_register_function,/** @export */m:__embind_register_integer,/** @export */h:__embind_register_memory_view,/** @export */W:__embind_register_std_string,/** @export */r:__embind_register_std_wstring,/** @export */Y:__embind_register_void,/** @export */g:__emval_create_invoker,/** @export */a:__emval_decref,/** @export */aa:__emval_get_global,/** @export */j:__emval_get_property,/** @export */k:__emval_incref,/** @export */$:__emval_instanceof,/** @export */f:__emval_invoke,/** @export */_:__emval_is_number,/** @export */z:__emval_is_string,/** @export */l:__emval_new_array,/** @export */b:__emval_new_cstring,/** @export */n:__emval_new_object,/** @export */A:__emval_new_u8string,/** @export */e:__emval_run_destructors,/** @export */c:__emval_set_property,/** @export */Z:__emval_typeof,/** @export */H:__gmtime_js,/** @export */F:__mmap_js,/** @export */G:__munmap_js,/** @export */I:__tzset_js,/** @export */S:_clock_time_get,/** @export */w:_emscripten_date_now,/** @export */D:_emscripten_get_heap_max,/** @export */s:_emscripten_get_now,/** @export */C:_emscripten_resize_heap,/** @export */K:_environ_get,/** @export */L:_environ_sizes_get,/** @export */p:_fd_close,/** @export */t:_fd_read,/** @export */J:_fd_seek,/** @export */o:_fd_write,/** @export */M:_random_get};// include: postamble.js
// === Auto-generated postamble setup entry stuff ===
function run(){preRun();function doRun(){// run may have just been called through dependencies being fulfilled just in this very frame,
// or while the async setStatus time below was happening
Module["calledRun"]=true;if(ABORT)return;initRuntime();readyPromiseResolve?.(Module);postRun()}{doRun()}}var wasmExports;// In modularize mode the generated code is within a factory function so we
// can use await here (since it's not top-level-await).
wasmExports=await (createWasm());run();// end include: postamble.js
// include: postamble_modularize.js
// In MODULARIZE mode we wrap the generated code in a factory function
// and return either the Module itself, or a promise of the module.
// We assign to the `moduleRtn` global here and configure closure to see
// this as and extern so it won't get minified.
if(runtimeInitialized){moduleRtn=Module}else{// Set up the promise that indicates the Module is initialized
moduleRtn=new Promise((resolve,reject)=>{readyPromiseResolve=resolve;readyPromiseReject=reject})}
;return moduleRtn}// Export using a UMD style export, or ES6 exports if selected
export default IrisSDK;
