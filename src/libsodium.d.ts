type Prt = number;

// export type Optional
export type Optional<T> = T | null | undefined;

export interface WasmModule {
  _crypto_box_easy: (
    ciphertext_address: Prt,
    message_address: Prt,
    message_llength_height: number,
    message_llength_low: number,
    nonce_address: Prt,
    publicKey_address: Prt,
    privateKey_address: Prt,
  ) => number;
  _crypto_box_open_easy: (
    plaintext_address: Prt,
    ciphertext_address: Prt,
    ciphertext_llength_height: number,
    ciphertext_llength_low: number,
    nonce_address: Prt,
    publicKey_address: Prt,
    privateKey_address: Prt,
  ) => number;
  _crypto_hash_sha256: (
    hash_address: Prt,
    message_address: Prt,
    message_llength_height: number,
    message_llength_low: number,
  ) => number;
  _crypto_hash_sha256_final: (state_address: Prt, hash_address: Prt) => number;
  _crypto_hash_sha256_init: (state_address: Prt) => number;
  _crypto_hash_sha256_update: (
    state_address: Prt,
    message_chunk_address: Prt,
    message_chunk_llength_height: number,
    message_chunk_llength_low: number,
  ) => number;
  _crypto_secretbox_easy: (
    cipher_address: Prt,
    message_address: Prt,
    message_llength_height: number,
    message_llength_low: number,
    nonce_address: Prt,
    key_address: Prt,
  ) => number;
  _crypto_secretbox_open_easy: (
    message_address: Prt,
    ciphertext_address: Prt,
    ciphertext_llength_height: number,
    ciphertext_llength_low: number,
    nonce_address: Prt,
    key_address: Prt,
  ) => number;
  _crypto_sign: (
    signature_address: Prt,
    signature_length_address: Optional<number>,
    message_address: Prt,
    message_llength_height: number,
    message_llength_low: number,
    privateKey_address: Prt,
  ) => number;
  _crypto_sign_detached: (
    signature_address: Prt,
    signature_length_address: Optional<number>,
    message_address: Prt,
    message_llength_height: number,
    message_llength_low: number,
    privateKey_address: Prt,
  ) => number;
  _crypto_sign_ed25519_pk_to_curve25519: (cPk_address: Prt, edPk_address: Prt) => number;
  _crypto_sign_ed25519_sk_to_curve25519: (cSk_address: Prt, edSk_address: Prt) => number;
  _crypto_sign_final_create: (
    state_address: Prt,
    signature_address: Prt,
    signature_length_address: Optional<number>,
    privateKey_address: Prt,
  ) => number;
  _crypto_sign_final_verify: (state_address: Prt, signature_address: Prt, publicKey_address: Prt) => number;
  _crypto_sign_init: (state_address: Prt) => number;
  _crypto_sign_keypair: (privateKey_address: Prt, publicKey_address: Prt) => number;
  _crypto_sign_open: (
    message_address: Prt,
    message_length_address: Optional<number>,
    signedMessage_address: Prt,
    signedMessage_llength_height: number,
    signedMessage_llength_low: number,
    publicKey_address: Prt,
  ) => number;
  _crypto_sign_seed_keypair: (privateKey_address: Prt, publicKey_address: Prt, seed_address: Prt) => number;
  _crypto_sign_update: (
    state_address: Prt,
    message_chunk_address: Prt,
    message_chunk_llength_height: number,
    message_chunk_llength_low: number,
  ) => number;
  _crypto_sign_verify_detached: (
    signature_address: Prt,
    message_address: Prt,
    message_llength_height: number,
    message_llength_low: number,
    publicKey_address: Prt,
  ) => number;
  _randombytes_buf: (output_address: Prt, length: number) => number;
  _randombytes_buf_deterministic: (output_address: Prt, length: number, seed_address: Prt) => number;
  _randombytes_close: () => number;
  _randombytes_random: () => number;
  _randombytes_stir: () => number;
  _randombytes_uniform: (upper_bound: number) => number;
  _sodium_version_string: () => number;
  _sodium_library_version_major: () => number;
  _sodium_library_version_minor: () => number;
  _crypto_box_macbytes: () => number;
  _crypto_box_noncebytes: () => number;
  _crypto_box_publickeybytes: () => number;
  _crypto_box_secretkeybytes: () => number;
  _crypto_hash_sha256_bytes: () => number;
  _crypto_scalarmult_scalarbytes: () => number;
  _crypto_secretbox_keybytes: () => number;
  _crypto_secretbox_macbytes: () => number;
  _crypto_secretbox_noncebytes: () => number;
  _crypto_sign_bytes: () => number;
  _crypto_sign_messagebytes_max: () => number;
  _crypto_sign_publickeybytes: () => number;
  _crypto_sign_secretkeybytes: () => number;
  _crypto_sign_seedbytes: () => number;

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
