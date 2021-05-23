type Prt = number;

// export type Optional
export type Optional<T> = T | null | undefined;

export interface WasmModule {
  /*{{libsodium_module_here}}*/
  _malloc: (length: number) => number;
  _free: (address: number) => void;

  _sodium_pad: (
    padded_buflen_p: Prt,
    buf: Prt,
    unpadded_buflen: number,
    blocksize: number,
    max_buflen: number,
  ) => number;
  _sodium_unpad: (unpadded_buflen_p: Prt, buf: Prt, padded_buflen: number, blocksize: number) => number;
  _sodium_bin2base64: (b64: Prt, b64_maxlen: number, bin: Prt, bin_len: Prt, variant: number) => number;
  _sodium_base642bin: (
    bin: Prt,
    bin_maxlen: number,
    b64: Prt,
    b64_len: number,
    ignore: Prt,
    bin_len: Prt,
    b64_end: Prt,
    variant: number,
  ) => number;
  _sodium_bin2hex: (hex: Prt, hex_maxlen: number, bin: Prt, bin_len: Prt, variant: number) => number;
  _sodium_hex2bin: (
    bin: Prt,
    bin_maxlen: number,
    hex: Prt,
    hex_len: number,
    ignore: Prt,
    bin_len: Prt,
    hex_end: Prt,
  ) => number;
  _randombytes_seedbytes: () => number;
}
export type InstantiateWasm = (
  imports: WebAssembly.Imports,
  receiveInstance: (instance: WebAssembly.Instance) => WasmModule, //WebAssembly.Instance["exports"],
) => WasmModule | Promise<WasmModule>;

export interface LibsodiumModule extends WasmModule {
  ready: Promise<void>;
  _sodium_init(): number;
  /**custom inject functions */
  instantiateWasm?: InstantiateWasm;
  wasmUrl?: string;
  getRandomValue: () => number;

  HEAPU8: Uint8Array;
  HEAP8: Int8Array;
  HEAP16: Int16Array;
  HEAP32: Int32Array;
  HEAPF32: Float32Array;
  HEAPF64: Float64Array;

  getValue: (ptr: Prt, type: ValueType) => number;
  setValue: (ptr: Prt, value: number, type: ValueType) => void;
  UTF8ToString: (prt: Prt) => string;
}
type ValueType = "i1" | "i8" | "i16" | "i32" | "i64" | "float" | "double";

type LibsodiumInstaller = (module: LibsodiumModule) => Promise<LibsodiumModule>;
const installer: LibsodiumInstaller;
export default installer;
