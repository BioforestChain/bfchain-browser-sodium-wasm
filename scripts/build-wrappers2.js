//@ts-check
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const prettier = require("prettier");
const prettierOptions = require("../.prettierrc.json");

const WRAPPER_DIR = path.join(__dirname, "deps/wrapper");
const docBuilder = require(path.join(WRAPPER_DIR, "build-doc"));

//Parse arguments
const argv = process.argv;
if (argv.length != 5) {
  console.error(`Usage: ${path.basename(__filename)} <libsodium module path> <API.md path> <output dir>`);
  process.exit(1);
}
const [_libsodiumModulePath, apiPath, _outputDir] = argv.slice(2);
const libsodiumModulePath = path.resolve(process.cwd(), _libsodiumModulePath);
const outputDir = path.resolve(process.cwd(), _outputDir);

const libsodiumModule = {
  instantiateWasm: () => {},
};
{
  const ctx = vm.createContext({ exports: {} });
  const libsodiumSourceCode = fs.readFileSync(libsodiumModulePath, "utf-8");
  const libsodiumScript = new vm.Script(
    path.extname(libsodiumModulePath) === ".mjs"
      ? libsodiumSourceCode.replace("export default", 'exports["Module"]=')
      : libsodiumSourceCode,
  );
  libsodiumScript.runInContext(ctx);
  /// 执行获取wasm实例
  ctx.exports.Module(libsodiumModule);
}

// load input symbol
const WASM_SYMBOL_NAMES = new Set();
{
  for (const symbolName of Object.keys(libsodiumModule)) {
    if (typeof libsodiumModule[symbolName] === "function") {
      WASM_SYMBOL_NAMES.add(symbolName);
    }
  }
}
// console.log(WASM_SYMBOL_NAMES);

//Loading preset macros
const MACROS = {};
{
  const macrosFiles = fs.readdirSync(path.join(WRAPPER_DIR, "macros"));
  for (const macroName of macrosFiles) {
    const macroNameInfo = path.parse(macroName);
    if (macroNameInfo.ext !== ".js") {
      continue;
    }
    const macroCode = fs.readFileSync(path.join(WRAPPER_DIR, "macros", macroName), "utf8");
    MACROS[macroNameInfo.name] = macroCode;
  }
}

let exportFunctionsCode = "";
let exportConstantsCode = "";
let exportKeysCode = "";
let exportLibsodiumModuleCode = "";

//Load symbols. Write their wrapping code without checking their existence in emcc-built library
const FUNCTION_SYMBOLS = [];
{
  const symbolsFiles = fs.readdirSync(path.join(WRAPPER_DIR, "symbols")).sort();
  for (const symbolFile of symbolsFiles) {
    const symbolFileInfo = path.parse(symbolFile);
    if (symbolFileInfo.ext !== ".json") {
      continue;
    }
    if (!WASM_SYMBOL_NAMES.has("_" + symbolFileInfo.name.toLowerCase())) {
      continue;
    }

    const currentSymbol = require(path.join(WRAPPER_DIR, "symbols", symbolFile));

    FUNCTION_SYMBOLS.push(currentSymbol);
  }
}
const CONSTANTS_SYMBOLS = loadConstants();

for (let i = 0; i < FUNCTION_SYMBOLS.length; i++) {
  buildSymbol(FUNCTION_SYMBOLS[i]);
}
exportKeys(FUNCTION_SYMBOLS.concat(CONSTANTS_SYMBOLS));
buildLibsodiumModuleCode(FUNCTION_SYMBOLS.concat(CONSTANTS_SYMBOLS));
exportConstants(CONSTANTS_SYMBOLS);
finalizeWrapper();

function exportKeys(symbols) {
  exportKeysCode = symbols.map((symbol) => `"${symbol.name}"`).join(",");
}

function exportConstants(constSymbols) {
  exportConstantsCode = `const _cacheDefineConstantsProp = (key:string,value:number)=>{
    Object.defineProperty(CONSTANTS,key,{
      value,
      writable:false,
      configurable: true,
      enumerable: true
    })
  };\n`;
  exportConstantsCode += `export const CONSTANTS = {
    ${constSymbols
      .map((symbol) => {
        return `get ${symbol.name}(){
          const constantsValue = libsodium._${symbol.name.toLowerCase()}();
          _cacheDefineConstantsProp("${symbol.name}", constantsValue);
          return constantsValue;
        }`;
      })
      .join(",\n")}
  };\n`;
}

function input2ParamType(currentParameter, symbolDescription) {
  const inputType = currentParameter.type;
  const name = currentParameter.name;

  if (inputType === "buf") {
    const paramInfo = {
      wrapper: `${name}: Uint8Array`,
      wasm: `${name}_address: Prt`,
    };
    if (currentParameter.length == undefined) {
      paramInfo.wasm += `, ${name}_length: number`;
    }
    return paramInfo;
  }

  if (inputType === "unsized_buf" || inputType === "minsized_buf") {
    const paramInfo = {
      wrapper: `${name}: Uint8Array`,
      wasm: `${name}_address: Prt`,
    };
    if (currentParameter.length == undefined) {
      paramInfo.wasm += `, ${name}_llength_height: number, ${name}_llength_low: number`;
    }
    return paramInfo;
  }
  if (inputType === "unsized_buf_optional") {
    const paramInfo = {
      wrapper: `${name}: Optional<Uint8Array>`,
      wasm: `${name}_address: Optional<Prt>`,
    };
    if (currentParameter.length == undefined) {
      paramInfo.wasm += `,  ${name}_size: number`;
    }
    return paramInfo;
  }

  if (inputType.endsWith("state_address")) {
    return { wrapper: `${name}: number`, wasm: `${name}: Prt` };
  }
  if (inputType === "uint") {
    return { wrapper: `${name}: number`, wasm: `${name}: number` };
  }
  console.warn("unknow input type:", inputType);
  return { wrapper: `${name}:${inputType}`, wasm: `${name}:${inputType}` };
}

function ouput2ParamType(currentParameter, symbolDescription) {
  const ouputType = currentParameter.type;
  const name = currentParameter.name;

  /**
   * C++的类型是：unsigned char *sm
   * 如果存在第二个参数：unsigned long long *smlen_p，是用来存储第一个参数的长度，但是可能可以不传
   */
  if (ouputType === "buf") {
    const paramInfo = {
      wrapper: `${name}: Uint8Array`,
      wasm: `${name}_address: Prt`,
    };
    if (currentParameter.length == undefined) {
      console.log(`output:${name} no define length!?`);
    }
    /// 如果存在动态计算的长度信息
    if (currentParameter.length) {
      if (
        /// 如果不是easy模式，需要手动传入长度信息
        (currentParameter.length.includes("+") && !symbolDescription.name.endsWith("_easy")) ||
        /// 如果是低级接口，那么可以获取长度信息
        symbolDescription.name.endsWith("_detached") ||
        symbolDescription.name.endsWith("_open") ||
        symbolDescription.name.includes("_final_")
      ) {
        paramInfo.wasm += `, ${name}_length_address: Optional<number>`;
      }
    }
    return paramInfo;
  }

  if (ouputType.endsWith("state")) {
    return { wrapper: `${name}: number`, wasm: `${name}_address: Prt` };
  }

  console.warn("unknow ouput type:", ouputType);
  return { wrapper: `${name}:${ouputType}`, wasm: `${name}_address: Prt` };
}

function buildSymbol(symbolDescription) {
  if (typeof symbolDescription != "object") throw new TypeError("symbolDescription must be a function");

  if (symbolDescription.type == "function") {
    let funcCode = "const " + symbolDescription.name + " = ";
    let funcBody = "";
    //Adding parameters array in function's interface, their conversions in the function's body
    const paramsArray = [];
    symbolDescription.inputs = symbolDescription.inputs || [];
    for (const currentParameter of symbolDescription.inputs) {
      const paramInfo = input2ParamType(currentParameter, symbolDescription);
      //Adding parameter in function's parameter list
      paramsArray.push(paramInfo.wrapper);

      //Adding the correspondant parameter handling macro, into the function body
      const currentParameterCode = MACROS["input_" + currentParameter.type];
      if (!currentParameterCode) {
        console.error("Unsupported input type " + currentParameter.type + "?");
        process.exit(1);
      }
      var substitutions = [{ from: "{var_name}", to: currentParameter.name }];
      if (currentParameter.length !== undefined) {
        substitutions.push({
          from: "{var_length}",
          to: currentParameter.length,
        });
      }
      if (currentParameter.min_length !== undefined) {
        substitutions.push({
          from: "{var_min_length}",
          to: currentParameter.min_length,
        });
      }
      const formatedParameterCode = applyMacro(
        currentParameterCode,
        substitutions.map((s) => s.from),
        substitutions.map((s) => s.to),
      );
      funcBody += formatedParameterCode + "\n";
    }

    if (!symbolDescription.noOutputFormat) {
      funcCode += `<T extends FormatReturnNames = "uint8array">`;
      paramsArray.push(`outputFormat: T = "uint8array" as T`);
    }
    funcCode += "(" + paramsArray.join(", ") + ") => {\n";
    funcCode += "  const address_pool = new AddressPool();\n";
    funcCode += "\n";
    if (!symbolDescription.noOutputFormat) {
      funcCode += "  _check_output_format(outputFormat);\n";
    }
    //Writing the outputs declaration code
    symbolDescription.outputs = symbolDescription.outputs || [];
    for (const currentOutput of symbolDescription.outputs) {
      const currentOutputCode = MACROS["output_" + currentOutput.type];
      if (!currentOutputCode) {
        console.error("What is the output type " + currentOutput.type + "?");
        process.exit(1);
      }
      var substitutions = [{ from: "{var_name}", to: currentOutput.name }];
      if (currentOutput.length !== undefined) {
        substitutions.push({ from: "{var_length}", to: currentOutput.length });
      }
      if (currentOutput.min_length !== undefined) {
        substitutions.push({
          from: "{var_min_length}",
          to: currentOutput.min_length,
        });
      }
      const formatedOutputCode = applyMacro(
        currentOutputCode,
        substitutions.map((s) => s.from),
        substitutions.map((s) => s.to),
      );
      funcBody += formatedOutputCode + "\n";
    }

    //Writing the target call
    if (symbolDescription.assert_retval !== undefined) {
      var target = symbolDescription.target;
      if (symbolDescription.assert_retval.length > 1) {
        funcBody += "var _ret = " + target + ";\n";
        target = "_ret";
      }

      if (symbolDescription.return !== undefined) {
        symbolDescription.assert_retval.forEach(function (assert) {
          funcBody += "if ((" + target + ") " + assert.condition + ") {\n";
          funcBody += "\tvar ret = " + symbolDescription.return + ";\n";
          funcBody += "\t_free_all(address_pool);\n";
          funcBody += "\treturn ret;\n";
          funcBody += "}\n";
          funcBody += "_free_and_throw_error(address_pool, " + '"' + assert.or_else_throw + '"' + ");\n";
        });
      } else {
        symbolDescription.assert_retval.forEach(function (assert) {
          funcBody += "if (!((" + target + ") " + assert.condition + ")) {\n";
          funcBody += "\t_free_and_throw_error(address_pool, " + '"' + assert.or_else_throw + '"' + ");\n";
          funcBody += "}\n";
          funcBody += "_free_all(address_pool);\n";
        });
      }
    } else if (symbolDescription.return !== undefined) {
      funcBody += sc(symbolDescription.target) + "\n";
      funcBody += "var ret = (" + symbolDescription.return + ");\n";
      funcBody += "_free_all(address_pool);\n";
      funcBody += "return ret;\n";
    } else {
      funcBody += sc(symbolDescription.target) + "\n";
    }
    funcCode += funcBody;
    funcCode += "}\n";

    exportFunctionsCode += `export ${funcCode}\n`;
  } else {
    console.error("Unknown symbol type " + symbolDescription.type);
    process.exit(1);
  }

  docBuilder.buildDocForSymbol(symbolDescription);
}

function buildLibsodiumModuleCode(symbols) {
  const libsodiumModuleCodeMap = new Map();
  for (const symbol of symbols) {
    const libsodiumName = "_" + symbol.name.toLowerCase();
    if (symbol.type == "function") {
      let libsodiumCode = `(`;
      const libsodiumParamsArray = [];

      for (const currentParameter of symbol.inputs || []) {
        const paramInfo = input2ParamType(currentParameter, symbol);
        //Adding parameter in function's parameter list
        libsodiumParamsArray.push(paramInfo.wasm);
      }

      const ouputPos = symbol.inputs.findIndex((input) => input.type.endsWith("state_address")) + 1;
      for (const currentOutput of symbol.outputs || []) {
        const typeInfo = ouput2ParamType(currentOutput, symbol);
        //Adding parameter in function's parameter list
        libsodiumParamsArray.splice(ouputPos, 0, typeInfo.wasm);
      }

      libsodiumCode += libsodiumParamsArray.join(", ") + ") => number,\n";

      libsodiumModuleCodeMap.set(libsodiumName, libsodiumCode);
    } else {
      libsodiumModuleCodeMap.set(libsodiumName, `() => number,\n`);
    }
  }
  for (const [name, code] of libsodiumModuleCodeMap) {
    exportLibsodiumModuleCode += `${name}:${code}`;
  }
}

function applyMacro(macroCode, symbols, substitutes) {
  if (typeof macroCode != "string") throw new TypeError("macroCode must be a string, not " + typeof macroCode);
  if (!(Array.isArray(symbols) && checkStrArray(symbols)))
    throw new TypeError("symbols must be an array of strings (found: " + typeof symbols + ")");
  if (!(Array.isArray(substitutes) && checkStrArray(substitutes)))
    throw new TypeError(
      "substitutes must be an array of strings for [" +
        macroCode +
        "] [" +
        substitutes +
        "] (found: " +
        typeof substitutes +
        ")",
    );
  if (symbols.length > substitutes.length) throw new TypeError("invalid array length for substitutes");

  for (var i = 0; i < symbols.length; i++) {
    macroCode = macroCode.split(symbols[i]).join(substitutes[i]);
  }
  return macroCode;
}

function finalizeWrapper() {
  fs.mkdirSync(outputDir, { recursive: true });
  const outputLibsodiumModulePath = path.join(outputDir, "libsodium.js");
  fs.copyFileSync(libsodiumModulePath, outputLibsodiumModulePath);

  const __libsodium_module_here__ = exportLibsodiumModuleCode;
  const __wraps_here__ = exportConstantsCode + exportFunctionsCode;
  const __export_keys_here__ = exportKeysCode;
  let __libsodium__ = path.relative(outputDir, outputLibsodiumModulePath);
  if (!(__libsodium__.startsWith("./") || __libsodium__.startsWith("../"))) {
    __libsodium__ = `./${__libsodium__}`;
  }
  const symbols_substitutes = [
    [
      "/*{{libsodium_module_here}}*/",
      "/*{{wraps_here}}*/",
      "/*{{export_keys_here}}*/",
      "/*{{libsodium}}*/",
      "{{libsodium}}",
    ],
    [
      //
      __libsodium_module_here__,
      __wraps_here__,
      __export_keys_here__,
      __libsodium__,
      __libsodium__,
    ],
  ];

  const tplDir = path.join(__dirname, "template");

  for (const tplName of fs.readdirSync(tplDir)) {
    const tplPath = path.join(tplDir, tplName);
    const outputPath = path.join(outputDir, tplName.replace(".tpl.", "."));
    fs.writeFileSync(
      outputPath,
      prettier.format(applyMacro(fs.readFileSync(tplPath, "utf-8"), ...symbols_substitutes), {
        ...prettierOptions,
        parser: "typescript",
      }),
    );
  }

  fs.writeFileSync(apiPath, docBuilder.getResultDoc());
}

function loadConstants() {
  const constList = require(path.join(WRAPPER_DIR, "constants.json"));
  if (!(Array.isArray(constList) && checkObjectArray(constList))) {
    console.error("constants file must contain an array of objects");
    process.exit(1);
  }
  var constSymbols = [];
  for (const item of constList) {
    if (!WASM_SYMBOL_NAMES.has("_" + item.name.toLowerCase())) {
      continue;
    }
    const currentConstant = {
      name: item.name,
      type: item.type,
    };
    constSymbols.push(currentConstant);
  }
  return constSymbols;
}

function checkStrArray(a) {
  for (var i = 0; i < a.length; i++) if (typeof a[i] !== "string") return false;
  return true;
}

function checkObjectArray(a) {
  for (var i = 0; i < a.length; i++) if (typeof a[i] !== "object") return false;
  return true;
}

//Inject a semi-colon at the end of the line, if one is missing
function sc(s) {
  if (s.lastIndexOf(";") != s.length - 1) return s + ";";
  else return s;
}
