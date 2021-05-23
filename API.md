# Libsodium.js wrapper - API usage

To learn about the role of each method, please refer to the original [documentation](https://doc.libsodium.org) of libsodium

List of existing types:
* `Buf`: An Uint8Array of a determined size. Used for keys, nonces, etc...
* `Unsized Buf`: An Uint8Array of an arbitrary size. Used for messages to sign, encrypt, hash, etc...
* `Minsized Buf`: An Uint8Array of a minimum size. Used for ciphertexts
* `Optional unsized buf`
* `Unsigned Integer`
* `Generichash state`
* `OneTimeAuth state`
* `Secretstream XChaCha20Poly1305 state`
* `Signature state`
* `Randombytes implementation`
* `String`
* outputFormat: A string indicating in which output format you want the result to be returned. Supported values are "uint8array", "text", "hex", "base64". Optional parameter. Not available on all functions. Defaults to uint8array.

Please note that a function that returns more than one variable will in fact return an object, which will contain the outputs in question and whose attributes will be named after the outputs' names

Please also note that these are the function available "in general" in the wrapper. The actual number of available functions in given build may be inferior to that, depending on what functions you choose to build to JS.

In addition to the main functions listed below, the library comes with a short list of helper methods. And here they are:
* `from_string(string)`: converts a standard string into a Uint8Array
* `to_string(buf)`: converts a Uint8Array to a standard string
* `to_hex(buf)`: returns the hexadecimal representation of the provided buf
* `from_hex(string)`: converts the provided hex-string into a Uint8Array and returns it
* `to_base64(buf, variant)`: returns the base64 representation of the provided buf
* `from_base64(string, variant)`: tries to convert the supposedly base64 string into a Uint8Array
* `symbols()`: returns a list of the currently methods and constants
* `raw`: attribute referencing the raw emscripten-built libsodium library that we are wrapping

## crypto_box_easy
Function

__Parameters:__
* `message`: Unsized buf
* `nonce`: Buf (size: undefined)
* `publicKey`: Buf (size: undefined)
* `privateKey`: Buf (size: undefined)

__Outputs:__
* `ciphertext`: Buf (size: undefined)


## crypto_box_open_easy
Function

__Parameters:__
* `ciphertext`: Minsized buf
* `nonce`: Buf (size: undefined)
* `publicKey`: Buf (size: undefined)
* `privateKey`: Buf (size: undefined)

__Outputs:__
* `plaintext`: Buf (size: undefined)


## crypto_hash_sha256
Function

__Parameters:__
* `message`: Unsized buf

__Outputs:__
* `hash`: Buf (size: undefined)


## crypto_hash_sha256_final
Function

__Parameters:__
* `state_address`: Sha256 state address

__Outputs:__
* `hash`: Buf (size: undefined)


## crypto_hash_sha256_init
Function

__Parameters:__

__Outputs:__
* `state`: Sha256 state


## crypto_hash_sha256_update
Function

__Parameters:__
* `state_address`: Sha256 state address
* `message_chunk`: Unsized buf

__Outputs:__
Boolean. True if method executed with success; false otherwise


## crypto_secretbox_easy
Function

__Parameters:__
* `message`: Unsized buf
* `nonce`: Buf (size: undefined)
* `key`: Buf (size: undefined)

__Outputs:__
* `cipher`: Buf (size: undefined)


## crypto_secretbox_open_easy
Function

__Parameters:__
* `ciphertext`: Minsized buf
* `nonce`: Buf (size: undefined)
* `key`: Buf (size: undefined)

__Outputs:__
* `message`: Buf (size: undefined)


## crypto_sign
Function

__Parameters:__
* `message`: Unsized buf
* `privateKey`: Buf (size: undefined)

__Outputs:__
* `signature`: Buf (size: undefined)


## crypto_sign_detached
Function

__Parameters:__
* `message`: Unsized buf
* `privateKey`: Buf (size: undefined)

__Outputs:__
* `signature`: Buf (size: undefined)


## crypto_sign_ed25519_pk_to_curve25519
Function

__Parameters:__
* `edPk`: Buf (size: undefined)

__Outputs:__
* `cPk`: Buf (size: undefined)


## crypto_sign_ed25519_sk_to_curve25519
Function

__Parameters:__
* `edSk`: Buf (size: undefined)

__Outputs:__
* `cSk`: Buf (size: undefined)


## crypto_sign_final_create
Function

__Parameters:__
* `state_address`: Signature state address
* `privateKey`: Buf (size: undefined)

__Outputs:__
* `signature`: Buf (size: undefined)


## crypto_sign_final_verify
Function

__Parameters:__
* `state_address`: Signature state address
* `signature`: Buf (size: undefined)
* `publicKey`: Buf (size: undefined)

__Outputs:__
Boolean. True if method executed with success; false otherwise


## crypto_sign_init
Function

__Parameters:__

__Outputs:__
* `state`: Signature state


## crypto_sign_keypair
Function

__Parameters:__

__Outputs:__
* `publicKey`: Buf (size: undefined)
* `privateKey`: Buf (size: undefined)


## crypto_sign_open
Function

__Parameters:__
* `signedMessage`: Minsized buf
* `publicKey`: Buf (size: undefined)

__Outputs:__
* `message`: Buf (size: undefined)


## crypto_sign_seed_keypair
Function

__Parameters:__
* `seed`: Buf (size: undefined)

__Outputs:__
* `publicKey`: Buf (size: undefined)
* `privateKey`: Buf (size: undefined)


## crypto_sign_update
Function

__Parameters:__
* `state_address`: Signature state address
* `message_chunk`: Unsized buf

__Outputs:__
Boolean. True if method executed with success; false otherwise


## crypto_sign_verify_detached
Function

__Parameters:__
* `signature`: Buf (size: undefined)
* `message`: Unsized buf
* `publicKey`: Buf (size: undefined)

__Outputs:__
Boolean. True if method executed with success; false otherwise


## randombytes_buf
Function

__Parameters:__
* `length`: Unsigned Integer

__Outputs:__
* `output`: Buf (size: undefined)


## randombytes_buf_deterministic
Function

__Parameters:__
* `length`: Unsigned Integer
* `seed`: Buf (size: undefined)

__Outputs:__
* `output`: Buf (size: undefined)


## randombytes_close
Function

__Parameters:__

__Outputs:__
Boolean. True if method executed with success; false otherwise


## randombytes_random
Function

__Parameters:__

__Outputs:__
Boolean. True if method executed with success; false otherwise


## randombytes_stir
Function

__Parameters:__

__Outputs:__
Boolean. True if method executed with success; false otherwise


## randombytes_uniform
Function

__Parameters:__
* `upper_bound`: Unsigned Integer

__Outputs:__
Boolean. True if method executed with success; false otherwise


## sodium_version_string
Function

__Parameters:__

__Outputs:__
Boolean. True if method executed with success; false otherwise


