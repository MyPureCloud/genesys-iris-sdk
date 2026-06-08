import IrisWebSDK from '@irisaudiotechnologies/iris-web-sdk';
import { IRIS_LIBRARY_DEFAULTS } from './types/interfaces';
import type { IGenesysIrisConfig, IIrisConfig } from './types/interfaces';

export class GenesysIrisClient {
  config: IGenesysIrisConfig;
  _config: IIrisConfig;
  _iris: any;

  constructor(config: IGenesysIrisConfig) {
    this.config = config;

    /**
     * IrisWebSDK expects `loggingLevel`, `audioAnalytics`, etc. as flat
     * top-level fields. We accept them grouped under `config.options` for
     * a nicer consumer API and flatten them here.
     */
    const { options, ...rest } = config;
    this._config = {
      ...rest,
      ...IRIS_LIBRARY_DEFAULTS,
      // loggingLevel: 2,
      // audioAnalytics: true,
      ...options,
      onReady: () => {
        console.warn('IRIS IS READY');
      },
    };
    console.warn('Resolved configuration:', this._config);

    this.initIrisSdk();
  }

  private async initIrisSdk() {
    this._iris = new IrisWebSDK(this._config);
    console.warn('IrisWebSDK initialized:', this._iris);
  }

  // Initializes the Iris audio context.
  public async init() { 
    try {
      const audioCtx = new AudioContext();
      await this._iris.init(audioCtx);
      console.warn('IrisAudioContexts initialized:', audioCtx);
    } catch (error) {
      console.error('Error initializing IrisAudioContexts. Enhanced noise suppression will not be available.', error);
    }
  }

  // Takes an outgoing media stream and returns an IRIS-processed media stream.
  // The returned stream contains a NEW MediaStreamTrack — callers MUST route
  // this track (not the original) to their RTCPeerConnection, otherwise IRIS
  // processing is wasted CPU and the far end hears the raw input.
  public process(mediaStream: MediaStream): MediaStream {
    const processedStream: MediaStream = this._iris.connectSendStream(mediaStream);

    this._iris.start();
    this._iris.crossFade(1, 'send');
    this._iris.setMixLevelMic(1);

    const rawTrack = mediaStream.getAudioTracks()[0];
    const processedTrack = processedStream.getAudioTracks()[0];
    console.warn('[GenesysIrisClient] process() — tracks:', {
      rawTrackId: rawTrack?.id,
      processedTrackId: processedTrack?.id,
      isDistinctTrack: rawTrack !== processedTrack,
    });

    return processedStream;
  }

  // Returns the most recent IRIS analytics snapshot, keyed by 'send' / 'receive'.
  // Use this to verify IRIS is actually suppressing in real time
  // (compare `contextInput` vs `contextOutput` in dB).
  public getAnalytics() {
    return this._iris.analyticsData as Map<'send' | 'receive', unknown> | undefined;
  }

  // Kills all IRIS processes. A new IRIS client will need to be created to start again.
  public destroy() {
    this._iris.cleanup();
    console.warn('Iris cleaned up');
  }
}
