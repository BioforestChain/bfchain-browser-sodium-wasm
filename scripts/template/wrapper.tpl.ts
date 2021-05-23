import libsodiumInstaller from "./libsodium";
import type { LibsodiumModule, Optional, InstantiateWasm } from "./libsodium";

export const libsodium = {} as LibsodiumModule;

const output_format = "uint8array";

let _installRes: Promise<InstallOptions | void> | undefined;
export type InstallOptions = {
  instantiateWasm?: InstantiateWasm;
  getRandomValue?: () => number;
};
export const install = (options?: InstallOptions) => {
  return _installRes || (_installRes = _install(options));
};
const _install = async (options?: InstallOptions) => {
  if (options) {
    libsodium.instantiateWasm = options.instantiateWasm;
    options.getRandomValue && (libsodium.getRandomValue = options.getRandomValue);
  }
  libsodiumInstaller(libsodium);

  await libsodium.ready;
  /* Test to make sure everything works.*/
  try {
    if (libsodium._sodium_init() !== 0) {
      throw new Error("libsodium was not correctly initialized.");
    }
    const message = new Uint8Array([98, 97, 108, 108, 115]);
    const nonce = randombytes_buf(CONSTANTS.crypto_secretbox_NONCEBYTES);
    const key = randombytes_buf(CONSTANTS.crypto_secretbox_KEYBYTES);
    const encrypted = crypto_secretbox_easy(message, nonce, key);
    const decrypted = crypto_secretbox_open_easy(encrypted, nonce, key);

    if (memcmp(message, decrypted)) {
      return options;
    }
  } catch (err) {
    console.log(err);
    throw new Error("/*{{libsodium}}*/ wasm failed to load" + err);
  }
};

// List of functions and constants defined in the wrapped libsodium
function symbols() {
  return [
    // "libsodium",
    // "ready",
    // "symbols",
    // "increment",
    // "add",
    // "is_zero",
    // "memzero",
    // "memcmp",
    // "compare",
    // "pad",
    // "unpad",
    // "from_string",
    // "to_string",
    // "from_hex",
    // "to_hex",
    // "base64_variants",
    // "from_base64",
    // "to_base64",
    // "output_formats",
    /*{{export_keys_here}}*/
  ];
}

function increment(bytes: Uint8Array) {
  if (!(bytes instanceof Uint8Array)) {
    throw new TypeError("Only Uint8Array instances can be incremented");
  }
  var c = 1 << 8;
  for (var i = 0 | 0, j = bytes.length; i < j; i++) {
    c >>= 8;
    c += bytes[i];
    bytes[i] = c & 0xff;
  }
}

function add(a: Uint8Array, b: Uint8Array) {
  if (!(a instanceof Uint8Array) || !(b instanceof Uint8Array)) {
    throw new TypeError("Only Uint8Array instances can added");
  }
  var j = a.length,
    c = 0 | 0,
    i = 0 | 0;
  if (b.length != a.length) {
    throw new TypeError("Arguments must have the same length");
  }
  for (i = 0; i < j; i++) {
    c >>= 8;
    c += a[i] + b[i];
    a[i] = c & 0xff;
  }
}

function is_zero(bytes: Uint8Array) {
  if (!(bytes instanceof Uint8Array)) {
    throw new TypeError("Only Uint8Array instances can be checked");
  }
  var d = 0 | 0;
  for (var i = 0 | 0, j = bytes.length; i < j; i++) {
    d |= bytes[i];
  }
  return d === 0;
}

function memzero(bytes: Uint8Array) {
  if (!(bytes instanceof Uint8Array)) {
    throw new TypeError("Only Uint8Array instances can be wiped");
  }
  for (var i = 0 | 0, j = bytes.length; i < j; i++) {
    bytes[i] = 0;
  }
}

function memcmp(b1: Uint8Array, b2: Uint8Array) {
  if (!(b1 instanceof Uint8Array && b2 instanceof Uint8Array)) {
    throw new TypeError("Only Uint8Array instances can be compared");
  }
  if (b1.length !== b2.length) {
    throw new TypeError("Only instances of identical length can be compared");
  }
  for (var d = 0 | 0, i = 0 | 0, j = b1.length; i < j; i++) {
    d |= b1[i] ^ b2[i];
  }
  return d === 0;
}

function compare(b1: Uint8Array, b2: Uint8Array) {
  if (!(b1 instanceof Uint8Array && b2 instanceof Uint8Array)) {
    throw new TypeError("Only Uint8Array instances can be compared");
  }
  if (b1.length !== b2.length) {
    throw new TypeError("Only instances of identical length can be compared");
  }
  for (var gt = 0 | 0, eq = 1 | 1, i = b1.length; i-- > 0; ) {
    gt |= ((b2[i] - b1[i]) >> 8) & eq;
    eq &= ((b2[i] ^ b1[i]) - 1) >> 8;
  }
  return gt + gt + eq - 1;
}

function pad(buf: Uint8Array, blocksize: number) {
  if (!(buf instanceof Uint8Array)) {
    throw new TypeError("buffer must be a Uint8Array");
  }
  blocksize |= 0;
  if (blocksize <= 0) {
    throw new Error("block size must be > 0");
  }
  var address_pool = [],
    padded,
    padded_buflen_p = _malloc(4),
    st = 1 | 0,
    i = 0 | 0,
    k = buf.length | 0,
    bufx = new AllocatedBuf(k + blocksize);
  address_pool.push(padded_buflen_p);
  address_pool.push(bufx.address);
  for (var j = bufx.address, jmax = bufx.address + k + blocksize; j < jmax; j++) {
    libsodium.HEAPU8[j] = buf[i];
    k -= st;
    st = ~(((((k >>> 48) | (k >>> 32) | (k >>> 16) | k) & 0xffff) - 1) >> 16) & 1;
    i += st;
  }
  if (libsodium._sodium_pad(padded_buflen_p, bufx.address, buf.length, blocksize, bufx.length) !== 0) {
    _free_and_throw_error(address_pool, "internal error");
  }
  bufx.length = libsodium.getValue(padded_buflen_p, "i32");
  padded = bufx.to_Uint8Array();
  _free_all(address_pool);
  return padded;
}

function unpad(buf: Uint8Array, blocksize: number) {
  if (!(buf instanceof Uint8Array)) {
    throw new TypeError("buffer must be a Uint8Array");
  }
  blocksize |= 0;
  if (blocksize <= 0) {
    throw new Error("block size must be > 0");
  }
  var address_pool = [],
    unpadded_address = _to_allocated_buf_address(buf),
    unpadded_buflen_p = _malloc(4);
  address_pool.push(unpadded_address);
  address_pool.push(unpadded_buflen_p);
  if (libsodium._sodium_unpad(unpadded_buflen_p, unpadded_address, buf.length, blocksize) !== 0) {
    _free_and_throw_error(address_pool, "unsupported/invalid padding");
  }
  buf = new Uint8Array(buf);
  buf = buf.subarray(0, libsodium.getValue(unpadded_buflen_p, "i32"));
  _free_all(address_pool);
  return buf;
}

//---------------------------------------------------------------------------
// Codecs
//
const dec = new TextEncoder();
export const from_string = dec.encode.bind(dec);

const enc = new TextDecoder("utf-8", {
  fatal: true,
});
export const to_string = enc.decode.bind(enc);

export function from_hex(input: string) {
  const address_pool = new AddressPool();
  const inputU8 = _any_to_Uint8Array(address_pool, input, "input");
  const result = new AllocatedBuf(inputU8.length / 2);
  const input_address = _to_allocated_buf_address(inputU8);
  const hex_end_p = _malloc(4);
  address_pool.push(input_address);
  address_pool.push(result.address);
  address_pool.push(hex_end_p);
  if (libsodium._sodium_hex2bin(result.address, result.length, input_address, inputU8.length, 0, 0, hex_end_p) !== 0) {
    _free_and_throw_error(address_pool, "invalid input");
  }
  const hex_end = libsodium.getValue(hex_end_p, "i32");
  if (hex_end - input_address !== inputU8.length) {
    _free_and_throw_error(address_pool, "incomplete input");
  }
  const result_str = result.to_Uint8Array();
  _free_all(address_pool);
  return result_str;
}

export function to_hex(input: Uint8Array) {
  input = _any_to_Uint8Array(null, input, "input");
  var str = "",
    b,
    c,
    x;
  for (var i = 0; i < input.length; i++) {
    c = input[i] & 0xf;
    b = input[i] >>> 4;
    x = ((87 + c + (((c - 10) >> 8) & ~38)) << 8) | (87 + b + (((b - 10) >> 8) & ~38));
    str += String.fromCharCode(x & 0xff) + String.fromCharCode(x >>> 8);
  }
  return str;
}

export enum base64_variants {
  ORIGINAL = 1 | 0,
  ORIGINAL_NO_PADDING = 3 | 0,
  URLSAFE = 5 | 0,
  URLSAFE_NO_PADDING = 7 | 0,
}

function check_base64_variant<T extends unknown>(variant: T | undefined) {
  if (variant == undefined) {
    return base64_variants.URLSAFE_NO_PADDING;
  }
  if (
    variant !== base64_variants.ORIGINAL &&
    variant !== base64_variants.ORIGINAL_NO_PADDING &&
    variant !== base64_variants.URLSAFE &&
    variant != base64_variants.URLSAFE_NO_PADDING
  ) {
    throw new Error("unsupported base64 variant");
  }
  return variant;
}

export function from_base64(input: string, variant?: base64_variants) {
  variant = check_base64_variant(variant);
  const address_pool = new AddressPool();
  const inputU8 = _any_to_Uint8Array(address_pool, input, "input");
  const result = new AllocatedBuf((inputU8.length * 3) / 4);
  const input_address = _to_allocated_buf_address(inputU8);
  const result_bin_len_p = _malloc(4);
  const b64_end_p = _malloc(4);
  address_pool.push(input_address);
  address_pool.push(result.address);
  address_pool.push(result_bin_len_p);
  address_pool.push(b64_end_p);
  if (
    libsodium._sodium_base642bin(
      result.address,
      result.length,
      input_address,
      inputU8.length,
      0,
      result_bin_len_p,
      b64_end_p,
      variant,
    ) !== 0
  ) {
    _free_and_throw_error(address_pool, "invalid input");
  }
  const b64_end = libsodium.getValue(b64_end_p, "i32");
  if (b64_end - input_address !== inputU8.length) {
    _free_and_throw_error(address_pool, "incomplete input");
  }
  result.length = libsodium.getValue(result_bin_len_p, "i32");
  const result_bin = result.to_Uint8Array();
  _free_all(address_pool);
  return result_bin;
}

export function to_base64(input: Uint8Array, variant?: base64_variants) {
  variant = check_base64_variant(variant);
  const address_pool = new AddressPool();
  input = _any_to_Uint8Array(address_pool, input, "input");
  const nibbles = Math.floor(input.length / 3) | 0;
  const remainder = input.length - 3 * nibbles;
  const b64_len = nibbles * 4 + (remainder !== 0 ? ((variant & 2) === 0 ? 4 : 2 + (remainder >>> 1)) : 0);
  const result = new AllocatedBuf(b64_len + 1);
  const input_address = _to_allocated_buf_address(input);
  address_pool.push(input_address);
  address_pool.push(result.address);
  if (libsodium._sodium_bin2base64(result.address, result.length, input_address, input.length, variant) === 0) {
    _free_and_throw_error(address_pool, "conversion failed");
  }
  result.length = b64_len;
  const result_b64 = to_string(result.to_Uint8Array());
  _free_all(address_pool);
  return result_b64;
}

export const output_formats = Object.freeze(["uint8array", "text", "hex", "base64"]);

namespace FormatReturn {
  export type Types = uint8array_type | undefined_type | text_type | hex_type | base64_type;
  export type Name<T> = T extends BaseType<infer F, infer _> ? F : never;
  export type GetReturn<F, T> = T extends BaseType<infer Format, infer O> ? (F extends Format ? O : never) : never;
  type BaseType<F, O> = [F, O];
  type uint8array_type = BaseType<"uint8array", Uint8Array>;
  type undefined_type = BaseType<undefined, Uint8Array>;
  type text_type = BaseType<"text", string>;
  type hex_type = BaseType<"hex", string>;
  type base64_type = BaseType<"base64", string>;
}
type FormatReturnNames = FormatReturn.Name<FormatReturn.Types>;

function _format_output<F extends FormatReturnNames>(
  output: AllocatedBuf,
  optionalOutputFormat: F,
): FormatReturn.GetReturn<F, FormatReturn.Types> {
  var selectedOutputFormat = optionalOutputFormat || output_format;
  if (!_is_output_format(selectedOutputFormat)) {
    throw new Error(selectedOutputFormat + " output format is not available");
  }
  if (output instanceof AllocatedBuf) {
    if (selectedOutputFormat === "uint8array") {
      return output.to_Uint8Array() as FormatReturn.GetReturn<F, FormatReturn.Types>;
    } else if (selectedOutputFormat === "text") {
      return to_string(output.to_Uint8Array()) as FormatReturn.GetReturn<F, FormatReturn.Types>;
    } else if (selectedOutputFormat === "hex") {
      return to_hex(output.to_Uint8Array()) as FormatReturn.GetReturn<F, FormatReturn.Types>;
    } else if (selectedOutputFormat === "base64") {
      return to_base64(output.to_Uint8Array(), base64_variants.URLSAFE_NO_PADDING) as FormatReturn.GetReturn<
        F,
        FormatReturn.Types
      >;
    }
    throw new Error('What is output format "' + selectedOutputFormat + '"?');
  }

  throw new TypeError("Cannot format output");
}
// function _format_multi_output(_format_output:{ [type: string]: AllocatedBuf } | string){}

function _is_output_format(format: unknown) {
  return output_formats.includes(format as never);
}

function _check_output_format(format?: string) {
  if (!format) {
    return;
  } else if (typeof format !== "string") {
    throw new TypeError("When defined, the output format must be a string");
  } else if (!_is_output_format(format)) {
    throw new Error(format + " is not a supported output format");
  }
}

//---------------------------------------------------------------------------
// Memory management
//
// AllocatedBuf: address allocated using _malloc() + length
class AllocatedBuf {
  constructor(public /* readonly */ length: number) {
    this.address = _malloc(length);
  }
  public readonly address: number;
  /**Copy the content of a AllocatedBuf (_malloc()'d memory) into a Uint8Array */
  to_Uint8Array() {
    var result = new Uint8Array(this.length);
    result.set(libsodium.HEAPU8.subarray(this.address, this.address + this.length));
    return result;
  }
}
class AddressPool extends Array<number> {
  push(add: number) {
    return (this[this.length] = add);
  }
}

// _malloc() a region and initialize it with the content of a Uint8Array
function _to_allocated_buf_address(bytes: Uint8Array) {
  var address = _malloc(bytes.length);
  libsodium.HEAPU8.set(bytes, address);
  return address;
}

function _malloc(length: number) {
  var result = libsodium._malloc(length);
  if (result === 0) {
    throw {
      message: "_malloc() failed",
      length: length,
    };
  }
  return result;
}

function _free(address: number) {
  libsodium._free(address);
}

function _free_all(addresses: AddressPool | null) {
  if (addresses) {
    for (var i = 0; i < addresses.length; i++) {
      _free(addresses[i]);
    }
  }
}

function _free_and_throw_error(address_pool: AddressPool | null, err: string): never {
  _free_all(address_pool);
  throw new Error(err);
}

function _free_and_throw_type_error(address_pool: AddressPool | null, err: string): never {
  _free_all(address_pool);
  throw new TypeError(err);
}

function _require_defined(address_pool: AddressPool | null, varValue: unknown, varName: string) {
  if (varValue == undefined) {
    _free_and_throw_type_error(address_pool, varName + " cannot be null or undefined");
  }
}

function _any_to_Uint8Array(address_pool: AddressPool | null, varValue: Uint8Array | string, varName: string) {
  _require_defined(address_pool, varValue, varName);
  if (varValue instanceof Uint8Array) {
    return varValue;
  } else if (typeof varValue === "string") {
    return from_string(varValue);
  }
  _free_and_throw_type_error(address_pool, "unsupported input type for " + varName);
}

/*{{wraps_here}}*/
