import { IrisBaseAWP } from './iris-base-awp.js';
import { IrisMessage } from './utils/consts.js';
import { getParameterDetails } from './utils/wasm-helper.js';

class IrisAWP extends IrisBaseAWP {
  constructor(options) {
    super();
    this.setOptions(options);
    this.analyticsEventCallback = (analyticsEvent) =>
      this.port.postMessage({ type: 'analytics', data: analyticsEvent });

    this.port.onmessage = (event) => this.handleMessages(event.data);
  }

  handleMessages(message) {
    if (
      message.type === IrisMessage.CREATE_CONTEXTS ||
      message.type === IrisMessage.SET_PARAMETER ||
      message.type === IrisMessage.TOGGLE_PROCESSING ||
      message.type === IrisMessage.RELEASE ||
      message.type === IrisMessage.WASM_BINARY
    ) {
      this.handleMessage(message);
    } else {
      this.setParameter(message);
    }
  }

  setParameter(message) {
    switch (message.type) {
      case IrisMessage.TOGGLE_NOISE_ANALYTICS: {
        const { value, logInterval } = message.data;
        this.options.analyticsReportingInterval = logInterval;
        this.parameterMessage(0, 'analytics', 'bypass', Number(!value));
        if (this.options.numberOfInputs === 2) {
          this.parameterMessage(1, 'analytics', 'bypass', Number(!value));
        }
        break;
      }
      case IrisMessage.TOGGLE_MIC:
        this.parameterMessage(
          0,
          this.options.processorOptions.models[0],
          'bypass',
          Number(!message.data)
        );
        break;
      case IrisMessage.TOGGLE_SPEAKER:
        this.parameterMessage(
          1,
          this.options.processorOptions.models[1],
          'bypass',
          Number(!message.data)
        );
        break;
      case IrisMessage.MIX_MIC:
        this.parameterMessage(
          0,
          this.options.processorOptions.models[0],
          'mix',
          message.data
        );
        break;
      case IrisMessage.MIX_SPEAKER:
        this.parameterMessage(
          1,
          this.options.processorOptions.models[1],
          'mix',
          message.data
        );
        break;
    }
  }

  parameterMessage(channel, processor, parameter, value) {
    if (!this.irisContexts[channel] || !this.parameterMap) return;

    const paramDetails = getParameterDetails(
      channel,
      processor,
      parameter,
      this.parameterMap
    );

    if (!paramDetails) return;

    const { contextId, paramId } = paramDetails;

    if (!contextId || !paramId) {
      this.port.postMessage({
        type: 'logging',
        data: `Bad message: ${
          (channel, processor, parameter, value)
        }. No contextId or paramId`
      });
      return;
    }
    this.handleMessage({
      type: 'setParameter',
      data: {
        contextId,
        paramId,
        value
      }
    });
  }
}

registerProcessor('iris-sdk', IrisAWP);
