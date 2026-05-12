const iris = {
    init,
    getSessionInfo,
    createAudioContext,
    process,
    processOffline,
    releaseAudioContext,
    cleanup,
    getParameter,
    setParameter,
    resetParameters,
    findParameterDescription,
    version,
    openSourceLicences
};
const ErrorCodes = {
    NO_ERROR: 0,
    PROCESSOR_UNSUPPORTED: 200,
    RESAMPLING: 300,
    SAMPLE_RATE_MISMATCH: 201
};
const LicenceStatus = {
    INVALID_ALGORITHM: 'Licence has invalid algorithm',
    INVALID_FORMAT: 'Licence format invalid',
    INVALID_KEY: 'Licence has invalid key',
    KEY_NOT_FOUND: 'Key not found',
    LICENCE_CORRUPT: 'Licence corrupt',
    LICENCE_EXPIRED: 'Licence expired',
    LICENCE_NOT_FOUND: 'Licence not found',
    LICENCE_TAMPERED: 'Licence has been tampered with',
    LICENCE_UNKNOWN: 'Licence unknown',
    LICENCE_VALID: 'Licence valid',
    UNKNOWN: 'Unknown status',
};
const OptimizationType = {
    CPU: 'cpu',
    SPEED: 'speed',
};
const ResamplerMode = {
    HQ: 'hq',
    SPEED: 'speed',
};
const ProgressEventType = {
    START: 'start',
    RESAMPLE: 'resample',
    PROCESS: 'process',
    END: 'end',
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
function init(license, key) {
    if (license && key) {
        return iris.init(license, key);
    }
    return iris.init();
}
/**
 * Information about the ongoing session
 */
function getSessionInfo() {
    return iris.getSessionInfo();
}
/**
 *
 * An audio processing context is used to process one continuous stream of audio. After an audio stream is stopped
 * a new context should be created to process further audio data and the current context should be released.
 * @param {AudioContextRequest} contextRequest - an AudioContextRequest object describing the required setup.
 * @return {AudioContextConfig} an AudioContextConfig object describing the created audio processing context.
 */
function createAudioContext(contextRequest) {
    return iris.createAudioContext(contextRequest);
}
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
function process(contextId, input, output, frames) {
    return iris.process(contextId, input, output, frames);
}
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
function processOffline(contextId, input, output, frames, callback) {
    if (callback) {
        return iris.processOffline(contextId, input, output, frames, callback);
    }
    return iris.processOffline(contextId, input, output, frames);
}
/**
 * Releases a previously created audio processing context that is no longer required.
 * @param {string} contextId.
 */
function releaseAudioContext(contextId) {
    return iris.releaseAudioContext(contextId);
}
/**
 * Set a value for an existing parameter.
 * @param {string} contextId. The contextId the parameter belongs to.
 * @param {string} parameterId. The parameterId for the parameter.
 * @return {string} contextId. The current value of the parameter.
 */
function getParameter(contextId, parameterId) {
    return iris.getParameter(contextId, parameterId);
}
/**
 * Set a value for an existing parameter.
 * @param {string} contextId. The contextId the parameter belongs to.
 * @param {string} parameterId. The parameterId for the parameter.
 * @param {number} vlaue. The value to set for the parameter.
 */
function setParameter(contextId, parameterId, value) {
    return iris.setParameter(contextId, parameterId, value);
}
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
function findParameterDescription(contextId, processorId, parameterName) {
    return iris.findParameterDescription(contextId, processorId, parameterName);
}
/**
 * Resets all parameters in a previously created audio processing context to
 * default values.
 * @param {string} contextId. The contextId to reset parameters for.
 */
function resetParameters(contextId) {
    return iris.resetParameters(contextId);
}
/**
 * Cleanup memory allocated by iris-sdk.
 */
function cleanup() {
    return iris.cleanup();
}
/**
 * Return the IRIS SDK version
 * @return {string} the version of the IRIS SDK.
 */
function version() {
    return iris.version();
}
/**
 * Licence information for 3rd-party software used by iris-sdk
 * @return {OpenSourceLicence}
 */
function openSourceLicences() {
    return iris.openSourceLicences();
}
export { ErrorCodes, LicenceStatus, OptimizationType, ProgressEventType, ResamplerMode, cleanup, getSessionInfo, createAudioContext, findParameterDescription, getParameter, init, openSourceLicences, process, processOffline, releaseAudioContext, resetParameters, setParameter, version };
export default iris;
