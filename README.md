# BFChain Browser Sodium WASM

> 这个项目是基于 libsodium，属于 libsodium 的辅助项目。
> 如果是 windows 系统，建议使用 WLS 来进行编译。

查看 [API 文档](./API.md)

## 和 libsodium 有什么不同？

1. 更加现代化的输出
   1. 直接编译出 Typescript 和 Wasm 文件，而不是将 wasm 以 base64 的编码嵌入到 JavaScript 文件中。
      > 这可能会增加编译者的负担，但我们将选择权交到开发者手上，因为不同的项目可能有各自的构建方案。
   1. 使用 esm 作为模块化标准，相比于 cjs，这能辅助 Typescript 导出精确的类型。
1. 自定义 wasm 的初始化加载
   > 在 libsodium 中，虽然也提供了类似的方案，但 wasm 的初始化是默认是自动运行的。我们将这一步暴露出来，并要求开发者主动注入，使得 Typescript 代码更加存粹。这也给多平台适配提供了基础。
1. 只针对 browser 平台来做输出
   > 兼容 nodejs 平台是一件很容易的事情，但要同时兼容 nodejs-cjs 和 nodejs-esm 可能会把事情变得很复杂。所以我们将这部分代码独立出来，建议使用 nodejs-vm 来进行兼容性构建，以省去不必要的平台判断的代码。
1. 自定义裁剪体积
   > 我们并不需要 libsodium 所有的 feature，所以我们提供了自适应脚本，只挑选有必要的函数进行导出。

## 如何依赖 libsodium

依赖的文件都在 scripts/deps 下

- wrapper 文件夹: 来自 libsodium.js/wrapper 文件夹
- libsodium.a 文件: 来自 libsodium.js/libsodium/libsodium-js/lib/libsodium.a 文件夹（需要先编译过 libsodium 之后才会有这个文件）

## 如何编译

1. 需要安装全局 emsdk
   > 这个工具建议全局安装使用，所以没有直接在项目的 npm-devDependencies 中列出
1. 安装依赖：`npm install`/`yarn`
1. 进行编译：`npm run build`
   > tmp: 文件夹下会有编译过程中的中间文件
   > src: 正式的 typescript 文件会输出到此处
   > build: 编译出来的 cjs、esm、wasm 都会在这里

## TODO

- [x] 输出 ts
- [x] 要求主动初始化 wasm，但默认提供 Wasm.initStream+fetch 的初始化
- [ ] 自动检测缺少了哪些接口，并自动补全
- [ ] 提供升级 libsodium 依赖的文档

## 如何自定义裁剪体积

libsodium 的有些接口是互相依赖的。你可以自定义配置 [scripts/build.sh]() 里头的编译参数 `EXPORTED_FUNCTIONS`。我们会对你的参数进行校验与补全。
EXPORTED_FUNCTIONS 的全部参数如下：

```
EXPORTED_FUNCTIONS=["_malloc","_free","_crypto_aead_chacha20poly1305_abytes","_crypto_aead_chacha20poly1305_decrypt","_crypto_aead_chacha20poly1305_decrypt_detached","_crypto_aead_chacha20poly1305_encrypt","_crypto_aead_chacha20poly1305_encrypt_detached","_crypto_aead_chacha20poly1305_ietf_abytes","_crypto_aead_chacha20poly1305_ietf_decrypt","_crypto_aead_chacha20poly1305_ietf_decrypt_detached","_crypto_aead_chacha20poly1305_ietf_encrypt","_crypto_aead_chacha20poly1305_ietf_encrypt_detached","_crypto_aead_chacha20poly1305_ietf_keybytes","_crypto_aead_chacha20poly1305_ietf_keygen","_crypto_aead_chacha20poly1305_ietf_messagebytes_max","_crypto_aead_chacha20poly1305_ietf_npubbytes","_crypto_aead_chacha20poly1305_ietf_nsecbytes","_crypto_aead_chacha20poly1305_keybytes","_crypto_aead_chacha20poly1305_keygen","_crypto_aead_chacha20poly1305_messagebytes_max","_crypto_aead_chacha20poly1305_npubbytes","_crypto_aead_chacha20poly1305_nsecbytes","_crypto_aead_xchacha20poly1305_ietf_abytes","_crypto_aead_xchacha20poly1305_ietf_decrypt","_crypto_aead_xchacha20poly1305_ietf_decrypt_detached","_crypto_aead_xchacha20poly1305_ietf_encrypt","_crypto_aead_xchacha20poly1305_ietf_encrypt_detached","_crypto_aead_xchacha20poly1305_ietf_keybytes","_crypto_aead_xchacha20poly1305_ietf_keygen","_crypto_aead_xchacha20poly1305_ietf_messagebytes_max","_crypto_aead_xchacha20poly1305_ietf_npubbytes","_crypto_aead_xchacha20poly1305_ietf_nsecbytes","_crypto_auth","_crypto_auth_bytes","_crypto_auth_keybytes","_crypto_auth_keygen","_crypto_auth_verify","_crypto_box_beforenm","_crypto_box_beforenmbytes","_crypto_box_detached","_crypto_box_detached_afternm","_crypto_box_easy","_crypto_box_easy_afternm","_crypto_box_keypair","_crypto_box_macbytes","_crypto_box_messagebytes_max","_crypto_box_noncebytes","_crypto_box_open_detached","_crypto_box_open_detached_afternm","_crypto_box_open_easy","_crypto_box_open_easy_afternm","_crypto_box_publickeybytes","_crypto_box_seal","_crypto_box_seal_open","_crypto_box_sealbytes","_crypto_box_secretkeybytes","_crypto_box_seed_keypair","_crypto_box_seedbytes","_crypto_generichash","_crypto_generichash_bytes","_crypto_generichash_bytes_max","_crypto_generichash_bytes_min","_crypto_generichash_final","_crypto_generichash_init","_crypto_generichash_keybytes","_crypto_generichash_keybytes_max","_crypto_generichash_keybytes_min","_crypto_generichash_keygen","_crypto_generichash_statebytes","_crypto_generichash_update","_crypto_hash","_crypto_hash_bytes","_crypto_kdf_bytes_max","_crypto_kdf_bytes_min","_crypto_kdf_contextbytes","_crypto_kdf_derive_from_key","_crypto_kdf_keybytes","_crypto_kdf_keygen","_crypto_kx_client_session_keys","_crypto_kx_keypair","_crypto_kx_publickeybytes","_crypto_kx_secretkeybytes","_crypto_kx_seed_keypair","_crypto_kx_seedbytes","_crypto_kx_server_session_keys","_crypto_kx_sessionkeybytes","_crypto_pwhash","_crypto_pwhash_alg_argon2i13","_crypto_pwhash_alg_argon2id13","_crypto_pwhash_alg_default","_crypto_pwhash_bytes_max","_crypto_pwhash_bytes_min","_crypto_pwhash_memlimit_interactive","_crypto_pwhash_memlimit_max","_crypto_pwhash_memlimit_min","_crypto_pwhash_memlimit_moderate","_crypto_pwhash_memlimit_sensitive","_crypto_pwhash_opslimit_interactive","_crypto_pwhash_opslimit_max","_crypto_pwhash_opslimit_min","_crypto_pwhash_opslimit_moderate","_crypto_pwhash_opslimit_sensitive","_crypto_pwhash_passwd_max","_crypto_pwhash_passwd_min","_crypto_pwhash_saltbytes","_crypto_pwhash_str","_crypto_pwhash_str_alg","_crypto_pwhash_str_needs_rehash","_crypto_pwhash_str_verify","_crypto_pwhash_strbytes","_crypto_pwhash_strprefix","_crypto_scalarmult","_crypto_scalarmult_base","_crypto_scalarmult_bytes","_crypto_scalarmult_scalarbytes","_crypto_secretbox_detached","_crypto_secretbox_easy","_crypto_secretbox_keybytes","_crypto_secretbox_keygen","_crypto_secretbox_macbytes","_crypto_secretbox_messagebytes_max","_crypto_secretbox_noncebytes","_crypto_secretbox_open_detached","_crypto_secretbox_open_easy","_crypto_secretstream_xchacha20poly1305_abytes","_crypto_secretstream_xchacha20poly1305_headerbytes","_crypto_secretstream_xchacha20poly1305_init_pull","_crypto_secretstream_xchacha20poly1305_init_push","_crypto_secretstream_xchacha20poly1305_keybytes","_crypto_secretstream_xchacha20poly1305_keygen","_crypto_secretstream_xchacha20poly1305_messagebytes_max","_crypto_secretstream_xchacha20poly1305_pull","_crypto_secretstream_xchacha20poly1305_push","_crypto_secretstream_xchacha20poly1305_rekey","_crypto_secretstream_xchacha20poly1305_statebytes","_crypto_secretstream_xchacha20poly1305_tag_final","_crypto_secretstream_xchacha20poly1305_tag_message","_crypto_secretstream_xchacha20poly1305_tag_push","_crypto_secretstream_xchacha20poly1305_tag_rekey","_crypto_shorthash","_crypto_shorthash_bytes","_crypto_shorthash_keybytes","_crypto_shorthash_keygen","_crypto_sign","_crypto_sign_bytes","_crypto_sign_detached","_crypto_sign_ed25519_pk_to_curve25519","_crypto_sign_ed25519_sk_to_curve25519","_crypto_sign_final_create","_crypto_sign_final_verify","_crypto_sign_init","_crypto_sign_keypair","_crypto_sign_messagebytes_max","_crypto_sign_open","_crypto_sign_publickeybytes","_crypto_sign_secretkeybytes","_crypto_sign_seed_keypair","_crypto_sign_seedbytes","_crypto_sign_statebytes","_crypto_sign_update","_crypto_sign_verify_detached","_randombytes","_randombytes_buf","_randombytes_buf_deterministic","_randombytes_close","_randombytes_random","_randombytes_seedbytes","_randombytes_stir","_randombytes_uniform","_sodium_base642bin","_sodium_base64_encoded_len","_sodium_bin2base64","_sodium_bin2hex","_sodium_hex2bin","_sodium_init","_sodium_library_minimal","_sodium_library_version_major","_sodium_library_version_minor","_sodium_pad","_sodium_unpad","_sodium_version_string"]
```
