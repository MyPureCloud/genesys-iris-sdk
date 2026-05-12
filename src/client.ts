import IrisWebSDK from '@irisaudiotechnologies/iris-web-sdk';
import { IRIS_LIBRARY_DEFAULTS } from './types/interfaces';
import type { IGenesysIrisConfig, IIrisConfig } from './types/interfaces';

export class GenesysIrisClient {
  config: IGenesysIrisConfig;
  _config: IIrisConfig;
  _iris: any;

  constructor(config: IGenesysIrisConfig) {
    /* set configurations */
    this.config = config;

    /* merge configurations */
    this._config = { ...config, ...IRIS_LIBRARY_DEFAULTS };
    console.warn('Resolved configuration:', this._config);

    this.initIrisSdk();
  }

  private async initIrisSdk() {
    this._iris = new IrisWebSDK(this._config);
    console.warn('IrisWebSDK initialized:', this._iris);

    try {
      await this.initIrisAudioContexts();
    } catch (error) {
      /* Don't throw error, just log it */
      console.error('Error initializing IrisAudioContexts. Enhanced noise suppression will not be available.', error);
    }
  }

  private async initIrisAudioContexts() { 
    const audioCtx = new AudioContext();
    await this._iris.init(audioCtx);
  }
}
