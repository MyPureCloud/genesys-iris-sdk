import { type Iris } from './iris-sdk';
interface SDKArgs {
    wasmBinary: ArrayBuffer;
}
interface WasmModule {
    HEAPF32: Float32Array;
    _free: (ptr: number) => void;
    _malloc: (ptr: number) => void;
}
type IrisSDK = Iris & WasmModule;
declare const IrisSDK: ({ wasmBinary }: SDKArgs) => Promise<IrisSDK>;
export * from './iris-sdk.js';
export default IrisSDK;
