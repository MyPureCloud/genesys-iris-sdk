declare const iris: Iris;
declare const ErrorCodes: {
    readonly NO_ERROR: 0;
    readonly PROCESSOR_UNSUPPORTED: 200;
    readonly RESAMPLING: 300;
    readonly SAMPLE_RATE_MISMATCH: 201;
};
declare const LicenceStatus: {
    readonly INVALID_ALGORITHM: "Licence has invalid algorithm";
    readonly INVALID_FORMAT: "Licence format invalid";
    readonly INVALID_KEY: "Licence has invalid key";
    readonly KEY_NOT_FOUND: "Key not found";
    readonly LICENCE_CORRUPT: "Licence corrupt";
    readonly LICENCE_EXPIRED: "Licence expired";
    readonly LICENCE_NOT_FOUND: "Licence not found";
    readonly LICENCE_TAMPERED: "Licence has been tampered with";
    readonly LICENCE_UNKNOWN: "Licence unknown";
    readonly LICENCE_VALID: "Licence valid";
    readonly UNKNOWN: "Unknown status";
};
declare const OptimizationType: {
    readonly CPU: "cpu";
    readonly SPEED: "speed";
};
declare const ResamplerMode: {
    readonly HQ: "hq";
    readonly SPEED: "speed";
};
declare const ProgressEventType: {
    readonly START: "start";
    readonly RESAMPLE: "resample";
    readonly PROCESS: "process";
    readonly END: "end";
};
/**
 * The SDK config returned after calling createAudioContext()
 */
interface Info {
    name: string;
    expiry: string;
    version: string;
    status: (typeof LicenceStatus)[keyof typeof LicenceStatus];
    availableProcessors: string[];
}
/**
 * The options inside createAudioContext()
 */
interface AudioContextRequest {
    processors: string[];
    sampleRate?: number;
    bufferLength?: number;
    channelCount?: number;
    planarChannelLayout?: boolean;
    fixedFrameCount?: boolean;
    optimization?: (typeof OptimizationType)[keyof typeof OptimizationType];
    resamplerMode?: (typeof ResamplerMode)[keyof typeof ResamplerMode];
}
/**
 * The SDK config returned after calling createAudioContext()
 */
interface AudioContextConfig {
    bufferLength: number;
    channelCount: number;
    contextId: string;
    description: string;
    error: (typeof ErrorCodes)[keyof typeof ErrorCodes];
    errorString?: string;
    planarChannelLayout: boolean;
    fixedFrameCount: boolean;
    frameOffset: number;
    instance: number;
    optimalBuffering: boolean;
    optimization: (typeof OptimizationType)[keyof typeof OptimizationType];
    parameters: ProcessorParameters[];
    resamplerMode: (typeof ResamplerMode)[keyof typeof ResamplerMode];
    sampleRate: number;
    willMix: boolean;
    willResample: boolean;
}
/**
 * IrisProcessors
 */
interface ProcessorParameters {
    id: string;
    name: string;
    parameterDescriptions: ParameterDescription[];
}
/**
 * ProcessorParameters
 */
interface ParameterDescription {
    defaultValue: string;
    displayName: string;
    id: string;
    isToggle: boolean;
    maxValue: number;
    minValue: number;
    name: string;
    skewValue: number;
    stepValue: number;
    unit: string;
}
/**
 * Represents an event returned by the processOffline callback.
 */
type ProgressEvent = {
    type: (typeof ProgressEventType)[keyof typeof ProgressEventType];
    percentage: number;
};
/**
 * The type of the ProgressEventCallback Function
 */
type ProgressEventCallback = (progressEvent: ProgressEvent) => void;
/**
 *Details of third-party Open Source software used within iris-sdk
 */
type OpenSourceLicence = {
    projectName: string;
    projectDescription: string;
    projectLicence: string;
    projectLink: string;
    licenceLink: string;
};
/**
 * The interface for the Iris Node SDK
 */
type Iris = {
    init: typeof init;
    getSessionInfo: typeof getSessionInfo;
    createAudioContext: typeof createAudioContext;
    process: typeof process;
    processOffline: typeof processOffline;
    releaseAudioContext: typeof releaseAudioContext;
    cleanup: typeof cleanup;
    getParameter: typeof getParameter;
    setParameter: typeof setParameter;
    resetParameters: typeof resetParameters;
    findParameterDescription: typeof findParameterDescription;
    version: typeof version;
    openSourceLicences: typeof openSourceLicences;
};
/**
 *
 * Initialise iris-sdk using a licence and key using a provided licence and key or from a fixed location if no
 * arguments provided.
 * By default, iris-sdk will search for the files iris.lic and iris.key in the following locations:
 * - `~/iris/licence/` on macos or linux
 * - `C:\Users\username\iris\licence\` on Windows
 *
 * To change the root directory, set the environment variable `IRIS_DATA` to a
 * desired location
 * @param {string?} license. The licence to use.
 * @param {string?} key. The key to use.
 * @return {Info } initialisation info.
 */
declare function init(license?: string, key?: string): Info;
/**
 * Information about the ongoing session
 */
declare function getSessionInfo(): string;
/**
 *
 * An audio processing context is used to process one continuous stream of audio. After an audio stream is stopped
 * a new context should be created to process further audio data and the current context should be released.
 * @param {AudioContextRequest} contextRequest - an AudioContextRequest object describing the required setup.
 * @return {AudioContextConfig} an AudioContextConfig object describing the created audio processing context.
 */
declare function createAudioContext(contextRequest: AudioContextRequest): AudioContextConfig;
/**
 * Processes sequential chunks of a contiguous audio stream through an existing audio processing context.
 *
 * Audio samples will be read from **input**, processed and placed into **output**. This function should be called continuously with short buffers of audio,
 * it is not intended to be used to process an entire file in one go.
 * The **frames** value here should match the :attr:`AudioContextConfig.buffer_length` unless the :attr:`AudioContextRequest.fixed_frame_count` was set to false.
 *
 * If the :attr:`AudioContextConfig.frame_offset` is non zero then the output data will be delayed by that offset.
 * If the provided **context_id** is not available or has previously been released then the output will contain silence.
 *
 * @param {string} contextId. The AudioContextConfig.contextId to use for processing
 * @param {Float32Array} input. 32 bit float array of length = frames * channels.
 * @param {Float32Array} output. 32 bit float array of length = frames * channels.
 * @param {number} frames. The number of frames in the input array. A frame
 * consists of 1 32 bit float per channel.
 */
declare function process(contextId: string, input: Float32Array, output: Float32Array, frames: number): void;
/**
 * Processes an entire large audio buffer through an existing audio processing context.
 * Audio samples will be read from **input**, processed and placed into **output**.
 *
 * This function should be called once with a large buffer to fully process, e.g. the contents of a file. It should not be used to process sequential chunks of an audio stream.
 * The entire buffer will be processed, accounting for and removing any incurred frame offset caused by resampling and processing.
 *
 * The **frames** should match the length of the input and output arrays.
 * If the provided **context_id** is not available or has previously been released then the output will contain silence.
 * @param {string} contextId. The AudioContextConfig.contextId to use for processing
 * @param {Float32Array} input. 32 bit float array of length = frames * channels.
 * @param {Float32Array} output. 32 bit float array of length = frames * channels.
 * @param {number} frames. The number of frames in the input array. A frame
 * consists of 1 32 bit float per channel.
 * @param {function} [callback].  An optional callback to report processing percentage completion.
 */
declare function processOffline(contextId: string, input: Float32Array, output: Float32Array, frames: number, callback?: ProgressEventCallback): void;
/**
 * Releases a previously created audio processing context that is no longer required.
 * @param {string} contextId.
 */
declare function releaseAudioContext(contextId: string): void;
/**
 * Set a value for an existing parameter.
 * @param {string} contextId. The contextId the parameter belongs to.
 * @param {string} parameterId. The parameterId for the parameter.
 * @return {string} contextId. The current value of the parameter.
 */
declare function getParameter(contextId: string, parameterId: string): number;
/**
 * Set a value for an existing parameter.
 * @param {string} contextId. The contextId the parameter belongs to.
 * @param {string} parameterId. The parameterId for the parameter.
 * @param {number} vlaue. The value to set for the parameter.
 */
declare function setParameter(contextId: string, parameterId: string, value: number): void;
/**
 * Find matching parameter descriptions within an audio processing context.
 *
 * If the returned vector is empty no parameters were found. If multiple
 * processors of the same type are in the audio processing chain the returned
 * vector will contain the matching parameters in the processing chain order.
 *
 * eg if the processor chain is gain,clarity,gain then searching for gain_db
 * would return 2 values. The first being the gain param for the first gain
 * processor in the chain, the second being the gain param for the second gain
 * processor in the chain.
 * @param {string} contextId. The contextId the parameter belongs to.
 * @param {string} processorId. The processor name to search for the parameter in.
 * @param {string} parameterName. The name of the parameter to search for.
 * @return {ProcessorParameters[]}
 */
declare function findParameterDescription(contextId: string, processorId: string, parameterName: string): ProcessorParameters[];
/**
 * Resets all parameters in a previously created audio processing context to
 * default values.
 * @param {string} contextId. The contextId to reset parameters for.
 */
declare function resetParameters(contextId: string): void;
/**
 * Cleanup memory allocated by iris-sdk.
 */
declare function cleanup(): void;
/**
 * Return the IRIS SDK version
 * @return {string} the version of the IRIS SDK.
 */
declare function version(): string;
/**
 * Licence information for 3rd-party software used by iris-sdk
 * @return {OpenSourceLicence}
 */
declare function openSourceLicences(): OpenSourceLicence;
export { AudioContextConfig, AudioContextRequest, ErrorCodes, Info, Iris, LicenceStatus, OpenSourceLicence, OptimizationType, ParameterDescription, ProcessorParameters, ProgressEvent, ProgressEventCallback, ProgressEventType, ResamplerMode, cleanup, getSessionInfo, createAudioContext, findParameterDescription, getParameter, init, openSourceLicences, process, processOffline, releaseAudioContext, resetParameters, setParameter, version };
export default iris;
