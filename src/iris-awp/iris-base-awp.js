import IrisSDK from './iris-sdk-wasm/index.js';
import { IrisMessage } from './utils/consts.js';
import {
  HeapAudioBuffer,
  MAX_CHANNEL_COUNT,
  RENDER_QUANTUM_FRAMES
} from './utils/wasm-audio-helper.js';
import { createParameterMap } from './utils/wasm-helper.js';

const LOG_NUM = 2000;

let then = new Date();

export class IrisBaseAWP extends AudioWorkletProcessor {
  count = 0;
  loggingLevel = 1;
  irisContexts = [];
  destroyed = false;
  running = false;

  constructor() {
    super();
  }

  async initIris(wasmBinary) {
    this.iris = await IrisSDK({ wasmBinary });

    if (this.loggingLevel > 0) {
      this.port.postMessage({
        type: IrisMessage.LOGGING,
        data: 'SDK initialised'
      });
    }
    this.info = this.iris.init(
      this.options.processorOptions.license,
      this.options.processorOptions.key
    );

    if (this.info.status !== 'Licence valid') {
      this.port.postMessage({
        type: IrisMessage.BAD_LICENSE,
        data: this.info.status
      });
      return;
    }

    if (this.loggingLevel > 1) {
      this.port.postMessage({
        type: IrisMessage.LOGGING,
        data: { ...this.info, status: this.info.status }
      });
    }

    this.port.postMessage({ type: IrisMessage.LOADED, data: this.info });
  }

  handleMessage(message) {
    switch (message.type) {
      case IrisMessage.WASM_BINARY:
        this.initIris(message.data);
        break;
      case IrisMessage.CREATE_CONTEXTS:
        this.createIrisAudioContexts();
        this.parameterMap = createParameterMap(this.irisContexts);
        break;
      case IrisMessage.SET_PARAMETER:
        this.iris.setParameter(
          message.data.contextId,
          message.data.paramId,
          message.data.value
        );
        break;
      case IrisMessage.CLEANUP:
        this.cleanup();
        break;
      case IrisMessage.RELEASE:
        this.release();
        break;
      case IrisMessage.TOGGLE_PROCESSING:
        this.running = message.data;
        break;
    }
  }

  setOptions(options) {
    this.options = options;
    this.loggingLevel = this.options.processorOptions.loggingLevel ?? 1;
  }

  createIrisAudioContexts() {
    if (this.loggingLevel > 0) {
      this.port.postMessage({
        type: IrisMessage.LOGGING,
        data: 'assigning memory'
      });
    }
    this.heapInputBuffer = new HeapAudioBuffer(
      this.iris,
      RENDER_QUANTUM_FRAMES,
      this.options.numberOfInputs,
      MAX_CHANNEL_COUNT
    );

    this.heapOutputBuffer = new HeapAudioBuffer(
      this.iris,
      RENDER_QUANTUM_FRAMES,
      this.options.numberOfInputs,
      MAX_CHANNEL_COUNT
    );
    for (let i = 0; i < this.options.numberOfInputs; i++) {
      if (this.loggingLevel > 1) {
        this.port.postMessage({
          type: IrisMessage.LOGGING,
          data: `creating iris context for input ${i}`
        });
      }
      const model = this.options.processorOptions.models[i];
      if (!this.info.availableProcessors.includes(model)) {
        const internalProcessors = [
          'compressor',
          'eq',
          'filter',
          'gain',
          'gate',
          'inverter',
          'passthrough',
          'volev'
        ];
        const availableProcessors = this.info.availableProcessors.filter(
          (item) => !internalProcessors.includes(item)
        );

        this.port.postMessage({
          type: IrisMessage.BAD_MODEL,
          data: {
            requested: this.options.processorOptions.models[i],
            available: availableProcessors
          }
        });
        return;
      }
      const configRequest = {
        sampleRate: this.options.processorOptions.sampleRate ?? sampleRate,
        bufferLength: RENDER_QUANTUM_FRAMES,
        channelCount: 1,
        processors: [model],
        fixedFrameCount: true,
        eventDetection: false,
        audioAnalytics: this.options.processorOptions.audioAnalytics ?? false,
        resamplerMode: 'speed',
        optimization: 'cpu'
      };
      const context = this.iris.createAudioContext(configRequest);
      context.instance = Number(i);

      this.irisContexts.push(context);

      if (this.loggingLevel > 1) {
        this.port.postMessage({
          type: IrisMessage.LOGGING,
          data: context
        });
      }
    }

    // set the analytics callback
    this.iris.setAudioAnalyticsCallback((analyticsEvent) => {
      if (!this.running) return;

      this.irisContexts?.map((context) => {
        if (analyticsEvent.contextId === context.contextId) {
          analyticsEvent.channel = context.instance;
          analyticsEvent.node = context.instance === 0 ? 'send' : 'receive';
        }
      });
      this.analyticsEventCallback(analyticsEvent);
    });

    this.running = true;

    this.port.postMessage({
      type: IrisMessage.READY,
      data: {
        configs: this.irisContexts,
        version: this.info.version
      }
    });
  }

  release() {
    this.irisContexts.forEach((context) => {
      this.iris.releaseAudioContext(context.contextId);
      if (this.loggingLevel > 0) {
        this.port.postMessage({
          type: IrisMessage.LOGGING,
          data: `released context ${context.contextId}`
        });
      }
    });
    this.irisContexts = [];
    this.running = false;
  }

  cleanup() {
    this.irisContexts = [];
    this.running = false;
    this.iris.cleanup();
    this.heapInputBuffer.free();
    this.heapOutputBuffer.free();
    this.destroyed = true;
  }

  process(inputs, outputs) {
    const shouldLog = this.loggingLevel > 1 && this.count % LOG_NUM === 0;
    const shouldLogTime = this.loggingLevel > 2 && this.count % 100 === 0;

    // No input
    if (!inputs || !inputs[0]) {
      if (shouldLog)
        this.port.postMessage({
          type: IrisMessage.LOGGING,
          data: 'no audio, not processing'
        });

      this.count++;

      return true;
    }

    // IRIS instance destroyed
    if (this.destroyed) {
      if (shouldLog)
        this.port.postMessage({
          type: IrisMessage.LOGGING,
          data: 'IRIS context has been destroyed, not processing'
        });

      this.count++;

      return true;
    }

    // IRIS processing paused
    if (!this.running) {
      if (shouldLog)
        this.port.postMessage({
          type: IrisMessage.LOGGING,
          data: 'IRIS context paused'
        });

      this.count++;

      return true;
    }

    inputs.forEach((input, index) => {
      if (!this.irisContexts[index]) {
        if (shouldLog) {
          this.port.postMessage({
            type: IrisMessage.LOGGING,
            data: `no processor for input ${index}, not processing`
          });
        }
        return true;
      }
      if (!input[0]) {
        if (shouldLog) {
          this.port.postMessage({
            type: IrisMessage.LOGGING,
            data: `no data in input ${index}, not processing`
          });
        }
        return true;
      }

      this.heapInputBuffer.getChannelData(index).set(input[0]);

      if (shouldLog) {
        this.port.postMessage({
          type: IrisMessage.LOGGING,
          data: `about to process input ${index}`
        });
      }

      this.iris.process(
        this.irisContexts[index].contextId,
        this.heapInputBuffer.getHeapAddress(index),
        this.heapOutputBuffer.getHeapAddress(index),
        RENDER_QUANTUM_FRAMES
      );

      outputs[index][0].set(this.heapOutputBuffer.getChannelData(index));
    });

    if (shouldLog) {
      this.port.postMessage({
        type: IrisMessage.LOGGING,
        data: 'done processing'
      });
    }

    this.count++;

    if (shouldLogTime) {
      const now = new Date();

      this.port.postMessage({
        type: IrisMessage.LOGGING,
        data: `time ${(now - then) / 1000}`
      });

      then = new Date();
    }
    return true;
  }
}
