/**
 * Configuration that must be supplied by the consumer of the SDK.
 */
export interface IGenesysIrisConfig {
  /** e.g. "IRIS" or "Google". REQUIRED */
  company: string;
  /** License key. REQUIRED */
  key: string;
  /** License string. REQUIRED */
  license: string;
  /** e.g. "Dev Team" or "Customer of IRIS". REQUIRED */
  team: string;
  /** Authenticated user, e.g. "USER_1234". REQUIRED */
  user: string;
  /**
   * Optional override for the AudioWorklet module URL.
   * Defaults to the worklet bundled with this package, resolved at build
   * time via `new URL(..., import.meta.url)` so the consumer's bundler
   * (Vite / webpack / etc.) can emit it as an asset on their own origin.
   */
  audioWorkletPath?: string;
  /** Optional override for the iris-sdk WASM URL. See `audioWorkletPath`. */
  wasmPath?: string;
}

/**
 * Library-internal constants that are merged with the consumer config
 * to produce the full runtime configuration.
 */
export interface IIrisLibraryDefaults {
  readonly audioWorkletPath: string;
  readonly model: 'wilson';
  readonly wasmPath: string;
}

/**
 * Full resolved configuration used internally by the SDK
 * (consumer config + library defaults).
 */
export interface IIrisConfig
  extends Omit<IGenesysIrisConfig, 'audioWorkletPath' | 'wasmPath'>,
    IIrisLibraryDefaults {}

/**
 * Default library values.
 *
 * `new URL(..., import.meta.url)` is the bundler-friendly way to ship a
 * static asset: at build time, tsdown / Vite / webpack / Rollup all
 * recognize the pattern, copy the referenced file into their own output,
 * and rewrite the URL. At runtime, the URL resolves to an asset on the
 * consumer's origin — which is what AudioWorklet / fetch require.
 */
export const IRIS_LIBRARY_DEFAULTS: IIrisLibraryDefaults = {
  audioWorkletPath: new URL('./iris-awp.js', import.meta.url).href,
  wasmPath: new URL('./iris-sdk-wasm.wasm', import.meta.url).href,
  model: 'wilson',
};
