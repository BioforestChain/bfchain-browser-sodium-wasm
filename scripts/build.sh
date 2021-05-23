emcc -O3 --llvm-lto 1 --no-entry -s RESERVED_FUNCTION_POINTERS=8 -s ALLOW_MEMORY_GROWTH=1 -s SINGLE_FILE=0 -s ASSERTIONS=0 -s AGGRESSIVE_VARIABLE_ELIMINATION=1 -s ALIASING_FUNCTION_POINTERS=1 -s DISABLE_EXCEPTION_CATCHING=1 -s ELIMINATE_DUPLICATE_FUNCTIONS=1 -s NODEJS_CATCH_EXIT=0 -s NODEJS_CATCH_REJECTION=0 -s TOTAL_MEMORY=16777216 -s EXPORTED_FUNCTIONS=["_malloc","_free","_crypto_box_easy","_crypto_box_publickeybytes","_crypto_box_secretkeybytes","_crypto_box_macbytes","_crypto_scalarmult_scalarbytes","_crypto_box_open_easy","_crypto_secretbox_easy","_crypto_box_noncebytes","_crypto_secretbox_keybytes","_crypto_secretbox_noncebytes","_crypto_secretbox_macbytes","_crypto_secretbox_open_easy","_crypto_sign","_crypto_sign_bytes","_crypto_sign_detached","_crypto_sign_ed25519_pk_to_curve25519","_crypto_sign_ed25519_sk_to_curve25519","_crypto_sign_final_create","_crypto_sign_final_verify","_crypto_sign_init","_crypto_sign_keypair","_crypto_sign_messagebytes_max","_crypto_sign_open","_crypto_sign_publickeybytes","_crypto_sign_secretkeybytes","_crypto_sign_seed_keypair","_crypto_sign_seedbytes","_crypto_sign_statebytes","_crypto_sign_update","_crypto_sign_verify_detached","_randombytes","_randombytes_buf","_randombytes_buf_deterministic","_randombytes_close","_randombytes_random","_randombytes_seedbytes","_randombytes_stir","_randombytes_uniform","_sodium_base642bin","_sodium_base64_encoded_len","_sodium_bin2base64","_sodium_bin2hex","_sodium_hex2bin","_sodium_init","_sodium_library_minimal","_sodium_library_version_major","_sodium_library_version_minor","_sodium_pad","_sodium_unpad","_sodium_version_string"] -s EXPORTED_RUNTIME_METHODS=["UTF8ToString","getValue","setValue"] -s MODULARIZE=1 --closure=0 --minify=0 scripts/deps/libsodium.a -o tmp/sodium.js

node scripts/libsodium-esm.js tmp/sodium.js tmp/sodium.mjs

node scripts/build-wrappers2.js tmp/sodium.mjs API.md src

# node_modules/.bin/esbuild src/index.ts --bundle --outfile=tmp/index.iife.js --format=iife --global-name=bfchainSodium
# node_modules/.bin/esbuild src/index.ts --bundle --outfile=tmp/index.cjs.js --format=cjs
# node_modules/.bin/esbuild src/index.ts --bundle --outfile=tmp/index.esm.js --format=esm

mkdir -p build/wasm
cp tmp/sodium.wasm build/wasm/sodium.wasm

tsc --build tsconfig.json
parcel build src/index.ts

# node_modules/.bin/google-closure-compiler -O=ADVANCED --language_out=ECMASCRIPT_2019 --warning_level=QUIET --js=build/iife/index.js --js_output_file=build/iife/index.min.js
# node_modules/.bin/google-closure-compiler -O=ADVANCED --language_out=ECMASCRIPT_2019 --warning_level=QUIET --js=build/cjs/index.js --js_output_file=build/cjs/index.min.js
# node_modules/.bin/google-closure-compiler -O=ADVANCED --language_out=ECMASCRIPT_2019 --warning_level=QUIET --js=build/esm/index.js --js_output_file=build/esm/index.min.js

# node_modules/.bin/terser --compress --mangle --ecma 2019 -o build/iife/index.js -- tmp/index.iife.js
# node_modules/.bin/terser --compress --mangle --ecma 2019 --parse bare_returns -o build/cjs/index.js -- tmp/index.cjs.js
# node_modules/.bin/terser --compress --mangle --ecma 2019 --module -o build/esm/index.js -- tmp/index.esm.js
