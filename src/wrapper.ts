import libsodiumInstaller from "./libsodium";
import type { LibsodiumModule, Optional, InstantiateWasm } from "./libsodium";

export const libsodium = {} as LibsodiumModule;

const output_format = "uint8array";

let _installRes: Promise<void> | undefined;
export const install = () => {
  return _installRes || (_installRes = _install());
};
const _install = async (options?: { instantiateWasm?: InstantiateWasm }) => {
  if (options) {
    libsodium.instantiateWasm = options.instantiateWasm;
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
      return;
    }
  } catch (err) {
    console.log(err);
    throw new Error("./libsodium.js wasm failed to load" + err);
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
    "crypto_box_easy",
    "crypto_box_open_easy",
    "crypto_secretbox_easy",
    "crypto_secretbox_open_easy",
    "crypto_sign",
    "crypto_sign_detached",
    "crypto_sign_ed25519_pk_to_curve25519",
    "crypto_sign_ed25519_sk_to_curve25519",
    "crypto_sign_final_create",
    "crypto_sign_final_verify",
    "crypto_sign_init",
    "crypto_sign_keypair",
    "crypto_sign_open",
    "crypto_sign_seed_keypair",
    "crypto_sign_update",
    "crypto_sign_verify_detached",
    "randombytes_buf",
    "randombytes_buf_deterministic",
    "randombytes_close",
    "randombytes_random",
    "randombytes_stir",
    "randombytes_uniform",
    "sodium_version_string",
    "SODIUM_LIBRARY_VERSION_MAJOR",
    "SODIUM_LIBRARY_VERSION_MINOR",
    "SODIUM_VERSION_STRING",
    "crypto_box_MACBYTES",
    "crypto_box_NONCEBYTES",
    "crypto_box_PUBLICKEYBYTES",
    "crypto_box_SECRETKEYBYTES",
    "crypto_scalarmult_SCALARBYTES",
    "crypto_secretbox_KEYBYTES",
    "crypto_secretbox_MACBYTES",
    "crypto_secretbox_NONCEBYTES",
    "crypto_sign_BYTES",
    "crypto_sign_MESSAGEBYTES_MAX",
    "crypto_sign_PUBLICKEYBYTES",
    "crypto_sign_SECRETKEYBYTES",
    "crypto_sign_SEEDBYTES",
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

const _cacheDefineConstantsProp = (key: string, value: number) => {
  Object.defineProperty(CONSTANTS, key, {
    value,
    writable: false,
    configurable: true,
    enumerable: true,
  });
};
export const CONSTANTS = {
  get SODIUM_LIBRARY_VERSION_MAJOR() {
    const constantsValue = libsodium._sodium_library_version_major();
    _cacheDefineConstantsProp("SODIUM_LIBRARY_VERSION_MAJOR", constantsValue);
    return constantsValue;
  },
  get SODIUM_LIBRARY_VERSION_MINOR() {
    const constantsValue = libsodium._sodium_library_version_minor();
    _cacheDefineConstantsProp("SODIUM_LIBRARY_VERSION_MINOR", constantsValue);
    return constantsValue;
  },
  get SODIUM_VERSION_STRING() {
    const constantsValue = libsodium._sodium_version_string();
    _cacheDefineConstantsProp("SODIUM_VERSION_STRING", constantsValue);
    return constantsValue;
  },
  get crypto_box_MACBYTES() {
    const constantsValue = libsodium._crypto_box_macbytes();
    _cacheDefineConstantsProp("crypto_box_MACBYTES", constantsValue);
    return constantsValue;
  },
  get crypto_box_NONCEBYTES() {
    const constantsValue = libsodium._crypto_box_noncebytes();
    _cacheDefineConstantsProp("crypto_box_NONCEBYTES", constantsValue);
    return constantsValue;
  },
  get crypto_box_PUBLICKEYBYTES() {
    const constantsValue = libsodium._crypto_box_publickeybytes();
    _cacheDefineConstantsProp("crypto_box_PUBLICKEYBYTES", constantsValue);
    return constantsValue;
  },
  get crypto_box_SECRETKEYBYTES() {
    const constantsValue = libsodium._crypto_box_secretkeybytes();
    _cacheDefineConstantsProp("crypto_box_SECRETKEYBYTES", constantsValue);
    return constantsValue;
  },
  get crypto_scalarmult_SCALARBYTES() {
    const constantsValue = libsodium._crypto_scalarmult_scalarbytes();
    _cacheDefineConstantsProp("crypto_scalarmult_SCALARBYTES", constantsValue);
    return constantsValue;
  },
  get crypto_secretbox_KEYBYTES() {
    const constantsValue = libsodium._crypto_secretbox_keybytes();
    _cacheDefineConstantsProp("crypto_secretbox_KEYBYTES", constantsValue);
    return constantsValue;
  },
  get crypto_secretbox_MACBYTES() {
    const constantsValue = libsodium._crypto_secretbox_macbytes();
    _cacheDefineConstantsProp("crypto_secretbox_MACBYTES", constantsValue);
    return constantsValue;
  },
  get crypto_secretbox_NONCEBYTES() {
    const constantsValue = libsodium._crypto_secretbox_noncebytes();
    _cacheDefineConstantsProp("crypto_secretbox_NONCEBYTES", constantsValue);
    return constantsValue;
  },
  get crypto_sign_BYTES() {
    const constantsValue = libsodium._crypto_sign_bytes();
    _cacheDefineConstantsProp("crypto_sign_BYTES", constantsValue);
    return constantsValue;
  },
  get crypto_sign_MESSAGEBYTES_MAX() {
    const constantsValue = libsodium._crypto_sign_messagebytes_max();
    _cacheDefineConstantsProp("crypto_sign_MESSAGEBYTES_MAX", constantsValue);
    return constantsValue;
  },
  get crypto_sign_PUBLICKEYBYTES() {
    const constantsValue = libsodium._crypto_sign_publickeybytes();
    _cacheDefineConstantsProp("crypto_sign_PUBLICKEYBYTES", constantsValue);
    return constantsValue;
  },
  get crypto_sign_SECRETKEYBYTES() {
    const constantsValue = libsodium._crypto_sign_secretkeybytes();
    _cacheDefineConstantsProp("crypto_sign_SECRETKEYBYTES", constantsValue);
    return constantsValue;
  },
  get crypto_sign_SEEDBYTES() {
    const constantsValue = libsodium._crypto_sign_seedbytes();
    _cacheDefineConstantsProp("crypto_sign_SEEDBYTES", constantsValue);
    return constantsValue;
  },
};
export const crypto_box_easy = <T extends FormatReturnNames = "uint8array">(
  message: Uint8Array,
  nonce: Uint8Array,
  publicKey: Uint8Array,
  privateKey: Uint8Array,
  outputFormat: T = "uint8array" as T,
) => {
  const address_pool = new AddressPool();

  _check_output_format(outputFormat);
  // ---------- input: message (unsized_buf)

  message = _any_to_Uint8Array(address_pool, message, "message");
  var message_address = _to_allocated_buf_address(message),
    message_length = message.length;
  address_pool.push(message_address);

  // ---------- input: nonce (buf)

  nonce = _any_to_Uint8Array(address_pool, nonce, "nonce");
  var nonce_address,
    nonce_length = libsodium._crypto_box_noncebytes() | 0;
  if (nonce.length !== nonce_length) {
    _free_and_throw_type_error(address_pool, "invalid nonce length");
  }
  nonce_address = _to_allocated_buf_address(nonce);
  address_pool.push(nonce_address);

  // ---------- input: publicKey (buf)

  publicKey = _any_to_Uint8Array(address_pool, publicKey, "publicKey");
  var publicKey_address,
    publicKey_length = libsodium._crypto_box_publickeybytes() | 0;
  if (publicKey.length !== publicKey_length) {
    _free_and_throw_type_error(address_pool, "invalid publicKey length");
  }
  publicKey_address = _to_allocated_buf_address(publicKey);
  address_pool.push(publicKey_address);

  // ---------- input: privateKey (buf)

  privateKey = _any_to_Uint8Array(address_pool, privateKey, "privateKey");
  var privateKey_address,
    privateKey_length = libsodium._crypto_box_secretkeybytes() | 0;
  if (privateKey.length !== privateKey_length) {
    _free_and_throw_type_error(address_pool, "invalid privateKey length");
  }
  privateKey_address = _to_allocated_buf_address(privateKey);
  address_pool.push(privateKey_address);

  // ---------- output ciphertext (buf)

  var ciphertext_length = (message_length + libsodium._crypto_box_macbytes()) | 0,
    ciphertext = new AllocatedBuf(ciphertext_length),
    ciphertext_address = ciphertext.address;

  address_pool.push(ciphertext_address);

  if (
    (libsodium._crypto_box_easy(
      ciphertext_address,
      message_address,
      message_length,
      0,
      nonce_address,
      publicKey_address,
      privateKey_address,
    ) |
      0) ===
    0
  ) {
    var ret = _format_output(ciphertext, outputFormat);
    _free_all(address_pool);
    return ret;
  }
  _free_and_throw_error(address_pool, "invalid usage");
};

export const crypto_box_open_easy = <T extends FormatReturnNames = "uint8array">(
  ciphertext: Uint8Array,
  nonce: Uint8Array,
  publicKey: Uint8Array,
  privateKey: Uint8Array,
  outputFormat: T = "uint8array" as T,
) => {
  const address_pool = new AddressPool();

  _check_output_format(outputFormat);
  // ---------- input: ciphertext (minsized_buf)

  ciphertext = _any_to_Uint8Array(address_pool, ciphertext, "ciphertext");
  var ciphertext_address,
    ciphertext_min_length = libsodium._crypto_box_macbytes(),
    ciphertext_length = ciphertext.length;
  if (ciphertext_length < ciphertext_min_length) {
    _free_and_throw_type_error(address_pool, "ciphertext is too short");
  }
  ciphertext_address = _to_allocated_buf_address(ciphertext);
  address_pool.push(ciphertext_address);

  // ---------- input: nonce (buf)

  nonce = _any_to_Uint8Array(address_pool, nonce, "nonce");
  var nonce_address,
    nonce_length = libsodium._crypto_box_noncebytes() | 0;
  if (nonce.length !== nonce_length) {
    _free_and_throw_type_error(address_pool, "invalid nonce length");
  }
  nonce_address = _to_allocated_buf_address(nonce);
  address_pool.push(nonce_address);

  // ---------- input: publicKey (buf)

  publicKey = _any_to_Uint8Array(address_pool, publicKey, "publicKey");
  var publicKey_address,
    publicKey_length = libsodium._crypto_box_publickeybytes() | 0;
  if (publicKey.length !== publicKey_length) {
    _free_and_throw_type_error(address_pool, "invalid publicKey length");
  }
  publicKey_address = _to_allocated_buf_address(publicKey);
  address_pool.push(publicKey_address);

  // ---------- input: privateKey (buf)

  privateKey = _any_to_Uint8Array(address_pool, privateKey, "privateKey");
  var privateKey_address,
    privateKey_length = libsodium._crypto_box_secretkeybytes() | 0;
  if (privateKey.length !== privateKey_length) {
    _free_and_throw_type_error(address_pool, "invalid privateKey length");
  }
  privateKey_address = _to_allocated_buf_address(privateKey);
  address_pool.push(privateKey_address);

  // ---------- output plaintext (buf)

  var plaintext_length = (ciphertext_length - libsodium._crypto_box_macbytes()) | 0,
    plaintext = new AllocatedBuf(plaintext_length),
    plaintext_address = plaintext.address;

  address_pool.push(plaintext_address);

  if (
    (libsodium._crypto_box_open_easy(
      plaintext_address,
      ciphertext_address,
      ciphertext_length,
      0,
      nonce_address,
      publicKey_address,
      privateKey_address,
    ) |
      0) ===
    0
  ) {
    var ret = _format_output(plaintext, outputFormat);
    _free_all(address_pool);
    return ret;
  }
  _free_and_throw_error(address_pool, "incorrect key pair for the given ciphertext");
};

export const crypto_secretbox_easy = <T extends FormatReturnNames = "uint8array">(
  message: Uint8Array,
  nonce: Uint8Array,
  key: Uint8Array,
  outputFormat: T = "uint8array" as T,
) => {
  const address_pool = new AddressPool();

  _check_output_format(outputFormat);
  // ---------- input: message (unsized_buf)

  message = _any_to_Uint8Array(address_pool, message, "message");
  var message_address = _to_allocated_buf_address(message),
    message_length = message.length;
  address_pool.push(message_address);

  // ---------- input: nonce (buf)

  nonce = _any_to_Uint8Array(address_pool, nonce, "nonce");
  var nonce_address,
    nonce_length = libsodium._crypto_secretbox_noncebytes() | 0;
  if (nonce.length !== nonce_length) {
    _free_and_throw_type_error(address_pool, "invalid nonce length");
  }
  nonce_address = _to_allocated_buf_address(nonce);
  address_pool.push(nonce_address);

  // ---------- input: key (buf)

  key = _any_to_Uint8Array(address_pool, key, "key");
  var key_address,
    key_length = libsodium._crypto_secretbox_keybytes() | 0;
  if (key.length !== key_length) {
    _free_and_throw_type_error(address_pool, "invalid key length");
  }
  key_address = _to_allocated_buf_address(key);
  address_pool.push(key_address);

  // ---------- output cipher (buf)

  var cipher_length = (message_length + libsodium._crypto_secretbox_macbytes()) | 0,
    cipher = new AllocatedBuf(cipher_length),
    cipher_address = cipher.address;

  address_pool.push(cipher_address);

  if (
    (libsodium._crypto_secretbox_easy(cipher_address, message_address, message_length, 0, nonce_address, key_address) |
      0) ===
    0
  ) {
    var ret = _format_output(cipher, outputFormat);
    _free_all(address_pool);
    return ret;
  }
  _free_and_throw_error(address_pool, "invalid usage");
};

export const crypto_secretbox_open_easy = <T extends FormatReturnNames = "uint8array">(
  ciphertext: Uint8Array,
  nonce: Uint8Array,
  key: Uint8Array,
  outputFormat: T = "uint8array" as T,
) => {
  const address_pool = new AddressPool();

  _check_output_format(outputFormat);
  // ---------- input: ciphertext (minsized_buf)

  ciphertext = _any_to_Uint8Array(address_pool, ciphertext, "ciphertext");
  var ciphertext_address,
    ciphertext_min_length = libsodium._crypto_secretbox_macbytes(),
    ciphertext_length = ciphertext.length;
  if (ciphertext_length < ciphertext_min_length) {
    _free_and_throw_type_error(address_pool, "ciphertext is too short");
  }
  ciphertext_address = _to_allocated_buf_address(ciphertext);
  address_pool.push(ciphertext_address);

  // ---------- input: nonce (buf)

  nonce = _any_to_Uint8Array(address_pool, nonce, "nonce");
  var nonce_address,
    nonce_length = libsodium._crypto_secretbox_noncebytes() | 0;
  if (nonce.length !== nonce_length) {
    _free_and_throw_type_error(address_pool, "invalid nonce length");
  }
  nonce_address = _to_allocated_buf_address(nonce);
  address_pool.push(nonce_address);

  // ---------- input: key (buf)

  key = _any_to_Uint8Array(address_pool, key, "key");
  var key_address,
    key_length = libsodium._crypto_secretbox_keybytes() | 0;
  if (key.length !== key_length) {
    _free_and_throw_type_error(address_pool, "invalid key length");
  }
  key_address = _to_allocated_buf_address(key);
  address_pool.push(key_address);

  // ---------- output message (buf)

  var message_length = (ciphertext_length - libsodium._crypto_secretbox_macbytes()) | 0,
    message = new AllocatedBuf(message_length),
    message_address = message.address;

  address_pool.push(message_address);

  if (
    (libsodium._crypto_secretbox_open_easy(
      message_address,
      ciphertext_address,
      ciphertext_length,
      0,
      nonce_address,
      key_address,
    ) |
      0) ===
    0
  ) {
    var ret = _format_output(message, outputFormat);
    _free_all(address_pool);
    return ret;
  }
  _free_and_throw_error(address_pool, "wrong secret key for the given ciphertext");
};

export const crypto_sign = <T extends FormatReturnNames = "uint8array">(
  message: Uint8Array,
  privateKey: Uint8Array,
  outputFormat: T = "uint8array" as T,
) => {
  const address_pool = new AddressPool();

  _check_output_format(outputFormat);
  // ---------- input: message (unsized_buf)

  message = _any_to_Uint8Array(address_pool, message, "message");
  var message_address = _to_allocated_buf_address(message),
    message_length = message.length;
  address_pool.push(message_address);

  // ---------- input: privateKey (buf)

  privateKey = _any_to_Uint8Array(address_pool, privateKey, "privateKey");
  var privateKey_address,
    privateKey_length = libsodium._crypto_sign_secretkeybytes() | 0;
  if (privateKey.length !== privateKey_length) {
    _free_and_throw_type_error(address_pool, "invalid privateKey length");
  }
  privateKey_address = _to_allocated_buf_address(privateKey);
  address_pool.push(privateKey_address);

  // ---------- output signature (buf)

  var signature_length = (message.length + libsodium._crypto_sign_bytes()) | 0,
    signature = new AllocatedBuf(signature_length),
    signature_address = signature.address;

  address_pool.push(signature_address);

  if (
    (libsodium._crypto_sign(signature_address, null, message_address, message_length, 0, privateKey_address) | 0) ===
    0
  ) {
    var ret = _format_output(signature, outputFormat);
    _free_all(address_pool);
    return ret;
  }
  _free_and_throw_error(address_pool, "invalid usage");
};

export const crypto_sign_detached = <T extends FormatReturnNames = "uint8array">(
  message: Uint8Array,
  privateKey: Uint8Array,
  outputFormat: T = "uint8array" as T,
) => {
  const address_pool = new AddressPool();

  _check_output_format(outputFormat);
  // ---------- input: message (unsized_buf)

  message = _any_to_Uint8Array(address_pool, message, "message");
  var message_address = _to_allocated_buf_address(message),
    message_length = message.length;
  address_pool.push(message_address);

  // ---------- input: privateKey (buf)

  privateKey = _any_to_Uint8Array(address_pool, privateKey, "privateKey");
  var privateKey_address,
    privateKey_length = libsodium._crypto_sign_secretkeybytes() | 0;
  if (privateKey.length !== privateKey_length) {
    _free_and_throw_type_error(address_pool, "invalid privateKey length");
  }
  privateKey_address = _to_allocated_buf_address(privateKey);
  address_pool.push(privateKey_address);

  // ---------- output signature (buf)

  var signature_length = libsodium._crypto_sign_bytes() | 0,
    signature = new AllocatedBuf(signature_length),
    signature_address = signature.address;

  address_pool.push(signature_address);

  if (
    (libsodium._crypto_sign_detached(signature_address, null, message_address, message_length, 0, privateKey_address) |
      0) ===
    0
  ) {
    var ret = _format_output(signature, outputFormat);
    _free_all(address_pool);
    return ret;
  }
  _free_and_throw_error(address_pool, "invalid usage");
};

export const crypto_sign_ed25519_pk_to_curve25519 = <T extends FormatReturnNames = "uint8array">(
  edPk: Uint8Array,
  outputFormat: T = "uint8array" as T,
) => {
  const address_pool = new AddressPool();

  _check_output_format(outputFormat);
  // ---------- input: edPk (buf)

  edPk = _any_to_Uint8Array(address_pool, edPk, "edPk");
  var edPk_address,
    edPk_length = libsodium._crypto_sign_publickeybytes() | 0;
  if (edPk.length !== edPk_length) {
    _free_and_throw_type_error(address_pool, "invalid edPk length");
  }
  edPk_address = _to_allocated_buf_address(edPk);
  address_pool.push(edPk_address);

  // ---------- output cPk (buf)

  var cPk_length = libsodium._crypto_scalarmult_scalarbytes() | 0,
    cPk = new AllocatedBuf(cPk_length),
    cPk_address = cPk.address;

  address_pool.push(cPk_address);

  if ((libsodium._crypto_sign_ed25519_pk_to_curve25519(cPk_address, edPk_address) | 0) === 0) {
    var ret = _format_output(cPk, outputFormat);
    _free_all(address_pool);
    return ret;
  }
  _free_and_throw_error(address_pool, "invalid key");
};

export const crypto_sign_ed25519_sk_to_curve25519 = <T extends FormatReturnNames = "uint8array">(
  edSk: Uint8Array,
  outputFormat: T = "uint8array" as T,
) => {
  const address_pool = new AddressPool();

  _check_output_format(outputFormat);
  // ---------- input: edSk (buf)

  edSk = _any_to_Uint8Array(address_pool, edSk, "edSk");
  var edSk_address,
    edSk_length = libsodium._crypto_sign_secretkeybytes() | 0;
  if (edSk.length !== edSk_length) {
    _free_and_throw_type_error(address_pool, "invalid edSk length");
  }
  edSk_address = _to_allocated_buf_address(edSk);
  address_pool.push(edSk_address);

  // ---------- output cSk (buf)

  var cSk_length = libsodium._crypto_scalarmult_scalarbytes() | 0,
    cSk = new AllocatedBuf(cSk_length),
    cSk_address = cSk.address;

  address_pool.push(cSk_address);

  if ((libsodium._crypto_sign_ed25519_sk_to_curve25519(cSk_address, edSk_address) | 0) === 0) {
    var ret = _format_output(cSk, outputFormat);
    _free_all(address_pool);
    return ret;
  }
  _free_and_throw_error(address_pool, "invalid key");
};

export const crypto_sign_final_create = <T extends FormatReturnNames = "uint8array">(
  state_address: number,
  privateKey: Uint8Array,
  outputFormat: T = "uint8array" as T,
) => {
  const address_pool = new AddressPool();

  _check_output_format(outputFormat);
  // ---------- input: state_address (sign_state_address)

  _require_defined(address_pool, state_address, "state_address");

  // ---------- input: privateKey (buf)

  privateKey = _any_to_Uint8Array(address_pool, privateKey, "privateKey");
  var privateKey_address,
    privateKey_length = libsodium._crypto_sign_secretkeybytes() | 0;
  if (privateKey.length !== privateKey_length) {
    _free_and_throw_type_error(address_pool, "invalid privateKey length");
  }
  privateKey_address = _to_allocated_buf_address(privateKey);
  address_pool.push(privateKey_address);

  // ---------- output signature (buf)

  var signature_length = libsodium._crypto_sign_bytes() | 0,
    signature = new AllocatedBuf(signature_length),
    signature_address = signature.address;

  address_pool.push(signature_address);

  if ((libsodium._crypto_sign_final_create(state_address, signature_address, null, privateKey_address) | 0) === 0) {
    var ret = (libsodium._free(state_address), _format_output(signature, outputFormat));
    _free_all(address_pool);
    return ret;
  }
  _free_and_throw_error(address_pool, "invalid usage");
};

export const crypto_sign_final_verify = <T extends FormatReturnNames = "uint8array">(
  state_address: number,
  signature: Uint8Array,
  publicKey: Uint8Array,
  outputFormat: T = "uint8array" as T,
) => {
  const address_pool = new AddressPool();

  _check_output_format(outputFormat);
  // ---------- input: state_address (sign_state_address)

  _require_defined(address_pool, state_address, "state_address");

  // ---------- input: signature (buf)

  signature = _any_to_Uint8Array(address_pool, signature, "signature");
  var signature_address,
    signature_length = libsodium._crypto_sign_bytes() | 0;
  if (signature.length !== signature_length) {
    _free_and_throw_type_error(address_pool, "invalid signature length");
  }
  signature_address = _to_allocated_buf_address(signature);
  address_pool.push(signature_address);

  // ---------- input: publicKey (buf)

  publicKey = _any_to_Uint8Array(address_pool, publicKey, "publicKey");
  var publicKey_address,
    publicKey_length = libsodium._crypto_sign_publickeybytes() | 0;
  if (publicKey.length !== publicKey_length) {
    _free_and_throw_type_error(address_pool, "invalid publicKey length");
  }
  publicKey_address = _to_allocated_buf_address(publicKey);
  address_pool.push(publicKey_address);

  var verificationResult = libsodium._crypto_sign_final_verify(state_address, signature_address, publicKey_address) | 0;
  var ret = verificationResult === 0;
  _free_all(address_pool);
  return ret;
};

export const crypto_sign_init = <T extends FormatReturnNames = "uint8array">(outputFormat: T = "uint8array" as T) => {
  const address_pool = new AddressPool();

  _check_output_format(outputFormat);
  // ---------- output state (sign_state)

  var state_address = new AllocatedBuf(208).address;

  if ((libsodium._crypto_sign_init(state_address) | 0) === 0) {
    var ret = state_address;
    _free_all(address_pool);
    return ret;
  }
  _free_and_throw_error(address_pool, "internal error");
};

export const crypto_sign_keypair = <T extends FormatReturnNames = "uint8array">(
  outputFormat: T = "uint8array" as T,
) => {
  const address_pool = new AddressPool();

  _check_output_format(outputFormat);
  // ---------- output publicKey (buf)

  var publicKey_length = libsodium._crypto_sign_publickeybytes() | 0,
    publicKey = new AllocatedBuf(publicKey_length),
    publicKey_address = publicKey.address;

  address_pool.push(publicKey_address);

  // ---------- output privateKey (buf)

  var privateKey_length = libsodium._crypto_sign_secretkeybytes() | 0,
    privateKey = new AllocatedBuf(privateKey_length),
    privateKey_address = privateKey.address;

  address_pool.push(privateKey_address);

  if ((libsodium._crypto_sign_keypair(publicKey_address, privateKey_address) | 0) === 0) {
    var ret = {
      publicKey: _format_output(publicKey, outputFormat),
      privateKey: _format_output(privateKey, outputFormat),
      keyType: "ed25519",
    };
    _free_all(address_pool);
    return ret;
  }
  _free_and_throw_error(address_pool, "internal error");
};

export const crypto_sign_open = <T extends FormatReturnNames = "uint8array">(
  signedMessage: Uint8Array,
  publicKey: Uint8Array,
  outputFormat: T = "uint8array" as T,
) => {
  const address_pool = new AddressPool();

  _check_output_format(outputFormat);
  // ---------- input: signedMessage (minsized_buf)

  signedMessage = _any_to_Uint8Array(address_pool, signedMessage, "signedMessage");
  var signedMessage_address,
    signedMessage_min_length = libsodium._crypto_sign_bytes(),
    signedMessage_length = signedMessage.length;
  if (signedMessage_length < signedMessage_min_length) {
    _free_and_throw_type_error(address_pool, "signedMessage is too short");
  }
  signedMessage_address = _to_allocated_buf_address(signedMessage);
  address_pool.push(signedMessage_address);

  // ---------- input: publicKey (buf)

  publicKey = _any_to_Uint8Array(address_pool, publicKey, "publicKey");
  var publicKey_address,
    publicKey_length = libsodium._crypto_sign_publickeybytes() | 0;
  if (publicKey.length !== publicKey_length) {
    _free_and_throw_type_error(address_pool, "invalid publicKey length");
  }
  publicKey_address = _to_allocated_buf_address(publicKey);
  address_pool.push(publicKey_address);

  // ---------- output message (buf)

  var message_length = (signedMessage_length - libsodium._crypto_sign_bytes()) | 0,
    message = new AllocatedBuf(message_length),
    message_address = message.address;

  address_pool.push(message_address);

  if (
    (libsodium._crypto_sign_open(
      message_address,
      null,
      signedMessage_address,
      signedMessage_length,
      0,
      publicKey_address,
    ) |
      0) ===
    0
  ) {
    var ret = _format_output(message, outputFormat);
    _free_all(address_pool);
    return ret;
  }
  _free_and_throw_error(address_pool, "incorrect signature for the given public key");
};

export const crypto_sign_seed_keypair = <T extends FormatReturnNames = "uint8array">(
  seed: Uint8Array,
  outputFormat: T = "uint8array" as T,
) => {
  const address_pool = new AddressPool();

  _check_output_format(outputFormat);
  // ---------- input: seed (buf)

  seed = _any_to_Uint8Array(address_pool, seed, "seed");
  var seed_address,
    seed_length = libsodium._crypto_sign_seedbytes() | 0;
  if (seed.length !== seed_length) {
    _free_and_throw_type_error(address_pool, "invalid seed length");
  }
  seed_address = _to_allocated_buf_address(seed);
  address_pool.push(seed_address);

  // ---------- output publicKey (buf)

  var publicKey_length = libsodium._crypto_sign_publickeybytes() | 0,
    publicKey = new AllocatedBuf(publicKey_length),
    publicKey_address = publicKey.address;

  address_pool.push(publicKey_address);

  // ---------- output privateKey (buf)

  var privateKey_length = libsodium._crypto_sign_secretkeybytes() | 0,
    privateKey = new AllocatedBuf(privateKey_length),
    privateKey_address = privateKey.address;

  address_pool.push(privateKey_address);

  if ((libsodium._crypto_sign_seed_keypair(publicKey_address, privateKey_address, seed_address) | 0) === 0) {
    var ret = {
      publicKey: _format_output(publicKey, outputFormat),
      privateKey: _format_output(privateKey, outputFormat),
      keyType: "ed25519",
    };
    _free_all(address_pool);
    return ret;
  }
  _free_and_throw_error(address_pool, "invalid usage");
};

export const crypto_sign_update = <T extends FormatReturnNames = "uint8array">(
  state_address: number,
  message_chunk: Uint8Array,
  outputFormat: T = "uint8array" as T,
) => {
  const address_pool = new AddressPool();

  _check_output_format(outputFormat);
  // ---------- input: state_address (sign_state_address)

  _require_defined(address_pool, state_address, "state_address");

  // ---------- input: message_chunk (unsized_buf)

  message_chunk = _any_to_Uint8Array(address_pool, message_chunk, "message_chunk");
  var message_chunk_address = _to_allocated_buf_address(message_chunk),
    message_chunk_length = message_chunk.length;
  address_pool.push(message_chunk_address);

  if (!((libsodium._crypto_sign_update(state_address, message_chunk_address, message_chunk_length, 0) | 0) === 0)) {
    _free_and_throw_error(address_pool, "invalid usage");
  }
  _free_all(address_pool);
};

export const crypto_sign_verify_detached = (signature: Uint8Array, message: Uint8Array, publicKey: Uint8Array) => {
  const address_pool = new AddressPool();

  // ---------- input: signature (buf)

  signature = _any_to_Uint8Array(address_pool, signature, "signature");
  var signature_address,
    signature_length = libsodium._crypto_sign_bytes() | 0;
  if (signature.length !== signature_length) {
    _free_and_throw_type_error(address_pool, "invalid signature length");
  }
  signature_address = _to_allocated_buf_address(signature);
  address_pool.push(signature_address);

  // ---------- input: message (unsized_buf)

  message = _any_to_Uint8Array(address_pool, message, "message");
  var message_address = _to_allocated_buf_address(message),
    message_length = message.length;
  address_pool.push(message_address);

  // ---------- input: publicKey (buf)

  publicKey = _any_to_Uint8Array(address_pool, publicKey, "publicKey");
  var publicKey_address,
    publicKey_length = libsodium._crypto_sign_publickeybytes() | 0;
  if (publicKey.length !== publicKey_length) {
    _free_and_throw_type_error(address_pool, "invalid publicKey length");
  }
  publicKey_address = _to_allocated_buf_address(publicKey);
  address_pool.push(publicKey_address);

  var verificationResult =
    libsodium._crypto_sign_verify_detached(signature_address, message_address, message_length, 0, publicKey_address) |
    0;
  var ret = verificationResult === 0;
  _free_all(address_pool);
  return ret;
};

export const randombytes_buf = <T extends FormatReturnNames = "uint8array">(
  length: number,
  outputFormat: T = "uint8array" as T,
) => {
  const address_pool = new AddressPool();

  _check_output_format(outputFormat);
  // ---------- input: length (uint)

  _require_defined(address_pool, length, "length");

  if (!(typeof length === "number" && (length | 0) === length) || length < 0) {
    _free_and_throw_type_error(address_pool, "length must be an unsigned integer");
  }

  // ---------- output output (buf)

  var output_length = length | 0,
    output = new AllocatedBuf(output_length),
    output_address = output.address;

  address_pool.push(output_address);

  libsodium._randombytes_buf(output_address, length);
  var ret = _format_output(output, outputFormat);
  _free_all(address_pool);
  return ret;
};

export const randombytes_buf_deterministic = <T extends FormatReturnNames = "uint8array">(
  length: number,
  seed: Uint8Array,
  outputFormat: T = "uint8array" as T,
) => {
  const address_pool = new AddressPool();

  _check_output_format(outputFormat);
  // ---------- input: length (uint)

  _require_defined(address_pool, length, "length");

  if (!(typeof length === "number" && (length | 0) === length) || length < 0) {
    _free_and_throw_type_error(address_pool, "length must be an unsigned integer");
  }

  // ---------- input: seed (buf)

  seed = _any_to_Uint8Array(address_pool, seed, "seed");
  var seed_address,
    seed_length = libsodium._randombytes_seedbytes() | 0;
  if (seed.length !== seed_length) {
    _free_and_throw_type_error(address_pool, "invalid seed length");
  }
  seed_address = _to_allocated_buf_address(seed);
  address_pool.push(seed_address);

  // ---------- output output (buf)

  var output_length = length | 0,
    output = new AllocatedBuf(output_length),
    output_address = output.address;

  address_pool.push(output_address);

  libsodium._randombytes_buf_deterministic(output_address, length, seed_address);
  var ret = _format_output(output, outputFormat);
  _free_all(address_pool);
  return ret;
};

export const randombytes_close = <T extends FormatReturnNames = "uint8array">(outputFormat: T = "uint8array" as T) => {
  const address_pool = new AddressPool();

  _check_output_format(outputFormat);
  libsodium._randombytes_close();
};

export const randombytes_random = <T extends FormatReturnNames = "uint8array">(outputFormat: T = "uint8array" as T) => {
  const address_pool = new AddressPool();

  _check_output_format(outputFormat);
  var random_value = libsodium._randombytes_random() >>> 0;
  var ret = random_value;
  _free_all(address_pool);
  return ret;
};

export const randombytes_stir = <T extends FormatReturnNames = "uint8array">(outputFormat: T = "uint8array" as T) => {
  const address_pool = new AddressPool();

  _check_output_format(outputFormat);
  libsodium._randombytes_stir();
};

export const randombytes_uniform = <T extends FormatReturnNames = "uint8array">(
  upper_bound: number,
  outputFormat: T = "uint8array" as T,
) => {
  const address_pool = new AddressPool();

  _check_output_format(outputFormat);
  // ---------- input: upper_bound (uint)

  _require_defined(address_pool, upper_bound, "upper_bound");

  if (!(typeof upper_bound === "number" && (upper_bound | 0) === upper_bound) || upper_bound < 0) {
    _free_and_throw_type_error(address_pool, "upper_bound must be an unsigned integer");
  }

  var random_value = libsodium._randombytes_uniform(upper_bound) >>> 0;
  var ret = random_value;
  _free_all(address_pool);
  return ret;
};

export const sodium_version_string = () => {
  const address_pool = new AddressPool();

  var version = libsodium._sodium_version_string();
  var ret = libsodium.UTF8ToString(version);
  _free_all(address_pool);
  return ret;
};
