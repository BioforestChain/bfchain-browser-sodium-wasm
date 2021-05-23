// @ts-check
const bfchainSodium = require("../");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

async function test() {
  await bfchainSodium.install({
    async instantiateWasm(imports, cb) {
      const result = await WebAssembly.instantiate(
        fs.readFileSync(path.join(__dirname, "../build/wasm/sodium.wasm")),
        imports,
      );
      return cb(result.instance);
    },
    getRandomValue() {
      return crypto.randomInt(0, 4294967295);
    },
  });
  const seed = crypto.createHash("sha256").update("qaq").digest();
  const keypair = bfchainSodium.crypto_sign_seed_keypair(seed);
  const dataForSign = Buffer.from("zzz".repeat(100));

  const sig = bfchainSodium.crypto_sign_detached(dataForSign, keypair.privateKey);
  console.log(Buffer.from(keypair.publicKey).toString("hex"));
  console.log(Buffer.from(keypair.privateKey).toString("hex"));
  console.log(Buffer.from(sig).toString("hex"));
  console.log(bfchainSodium.crypto_sign_verify_detached(sig, dataForSign, keypair.publicKey));
}
test();
