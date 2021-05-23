//@ts-check
const fs = require("fs");
const path = require("path");
const prettier = require("prettier");
const prettierOptions = require("../.prettierrc.json");

//Parse arguments
const argv = process.argv;
if (argv.length !== 4) {
  console.error(`Usage: ${path.basename(__filename)} <libsodium module path> <esm path>`);
  process.exit(1);
}
const [_libsodiumModulePath, _esmPath] = argv.slice(2);
const libsodiumModulePath = path.resolve(process.cwd(), _libsodiumModulePath);
const esmPath = _esmPath
  ? path.resolve(process.cwd(), _esmPath)
  : path.resolve(path.dirname(libsodiumModulePath), path.basename(libsodiumModulePath));

const libsodiumModuleSourceCode = fs.readFileSync(libsodiumModulePath, "utf-8");
let esmSourceCode = libsodiumModuleSourceCode;
/// 把第一个function移除，包括内部的_scriptDir，直接返回内部function
{
  const function2Index = esmSourceCode.indexOf("function", esmSourceCode.indexOf("function") + 1);
  esmSourceCode = esmSourceCode.slice(function2Index);
}
/// 移除掉第一个function的末尾，包括的umd导出代码
{
  const function1EndIndex = esmSourceCode.indexOf(`);
})();`);
  esmSourceCode = esmSourceCode.slice(0, function1EndIndex);
}
/// 直接使用 export default 来进行导出
{
  esmSourceCode = `
//@ts-check
const libsodiumModule = ${esmSourceCode}
export default libsodiumModule`;
}

/// 使用高版本的语法来设置默认参数
{
  esmSourceCode = esmSourceCode
    .replace(`(Module)`, `(Module={})`)
    .replace(`Module = Module || {};`, "")
    .replace(`var Module = typeof Module !== "undefined" ? Module : {};`, "");
}
/// 清理跟 Module启动 与 ENVIRONMENT_IS_* 相关的代码
{
  const startCode = `var moduleOverrides = {}`;
  const endCode = `if (typeof WebAssembly !== "object")`;
  const startIndex = esmSourceCode.indexOf(startCode);
  const endIndex = esmSourceCode.indexOf(endCode, startIndex);
  esmSourceCode =
    esmSourceCode.slice(0, startIndex) +
    `var err = Module["printErr"] || console.warn.bind(console);\n` +
    esmSourceCode.slice(endIndex).replace(`args = args || arguments_;`, "");
}

/// 简化createWASM相关的代码
{
  const startCode = `var dataURIPrefix = "data:application/octet-stream;base64,";`;
  const endCode = `var tempDouble;`;
  const startIndex = esmSourceCode.indexOf(startCode);
  const endIndex = esmSourceCode.indexOf(endCode, startIndex);
  esmSourceCode =
    esmSourceCode.slice(0, startIndex) +
    `async function createWasm() {
        const info = {
          a: asmLibraryArg,
        };
        function receiveInstance(instance) {
          const exports = instance.exports;
          Module["asm"] = exports;
          wasmMemory = exports["g"];
          updateGlobalBufferAndViews(wasmMemory.buffer);
          wasmTable = exports["_"];
          addOnInit(exports["h"]);
          removeRunDependency("wasm-instantiate");
          return exports;
        }
        addRunDependency("wasm-instantiate");

        try {
          if (Module["instantiateWasm"]) {
            return await Module["instantiateWasm"](info, receiveInstance);
          }
          const result = await WebAssembly.instantiateStreaming(
            fetch("sodium.wasm", {
              credentials: "same-origin",
            }),
            info
          )
          return receiveInstance(result.instance);
        } catch (e) {
          try{
            abort(e)
          }catch(e){
            readyPromiseReject(e)
          }
          err("Module.instantiateWasm callback failed with error: " + e);
          abort(e);
          return false
        }
      }` +
    esmSourceCode.slice(endIndex);
}

/// 简化getRandomValue的实现
{
  const startCode = `if (Module.getRandomValue === undefined) {`;
  const endCode = `\n  }`;
  const startIndex = esmSourceCode.indexOf(startCode);
  const endIndex = esmSourceCode.indexOf(endCode, startIndex);
  esmSourceCode =
    esmSourceCode.slice(0, startIndex + startCode.length) +
    `Module.getRandomValue = ()=> {
        var buf = new Uint32Array(1);
        crypto.getRandomValues(buf);
        return buf[0] >>> 0;
    };` +
    esmSourceCode.slice(endIndex).replace(`args = args || arguments_;`, "");
}

fs.writeFileSync(esmPath, prettier.format(esmSourceCode, { ...prettierOptions, parser: "babel" }));
