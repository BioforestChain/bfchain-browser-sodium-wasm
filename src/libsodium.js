//@ts-check
const libsodiumModule = function (Module = {}) {
  var readyPromiseResolve, readyPromiseReject;

  Module["ready"] = new Promise(function (resolve, reject) {
    readyPromiseResolve = resolve;
    readyPromiseReject = reject;
  });

  var err = Module["printErr"] || console.warn.bind(console);
  if (typeof WebAssembly !== "object") {
    abort("no native wasm support detected");
  }

  function setValue(ptr, value, type, noSafe) {
    type = type || "i8";
    if (type.charAt(type.length - 1) === "*") type = "i32";
    switch (type) {
      case "i1":
        HEAP8[ptr >> 0] = value;
        break;

      case "i8":
        HEAP8[ptr >> 0] = value;
        break;

      case "i16":
        HEAP16[ptr >> 1] = value;
        break;

      case "i32":
        HEAP32[ptr >> 2] = value;
        break;

      case "i64":
        (tempI64 = [
          value >>> 0,
          ((tempDouble = value),
          +Math.abs(tempDouble) >= 1
            ? tempDouble > 0
              ? (Math.min(+Math.floor(tempDouble / 4294967296), 4294967295) | 0) >>> 0
              : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0
            : 0),
        ]),
          (HEAP32[ptr >> 2] = tempI64[0]),
          (HEAP32[(ptr + 4) >> 2] = tempI64[1]);
        break;

      case "float":
        HEAPF32[ptr >> 2] = value;
        break;

      case "double":
        HEAPF64[ptr >> 3] = value;
        break;

      default:
        abort("invalid type for setValue: " + type);
    }
  }

  function getValue(ptr, type, noSafe) {
    type = type || "i8";
    if (type.charAt(type.length - 1) === "*") type = "i32";
    switch (type) {
      case "i1":
        return HEAP8[ptr >> 0];

      case "i8":
        return HEAP8[ptr >> 0];

      case "i16":
        return HEAP16[ptr >> 1];

      case "i32":
        return HEAP32[ptr >> 2];

      case "i64":
        return HEAP32[ptr >> 2];

      case "float":
        return HEAPF32[ptr >> 2];

      case "double":
        return HEAPF64[ptr >> 3];

      default:
        abort("invalid type for getValue: " + type);
    }
    return null;
  }

  var wasmMemory;

  var ABORT = false;

  var EXITSTATUS;

  function assert(condition, text) {
    if (!condition) {
      abort("Assertion failed: " + text);
    }
  }

  var UTF8Decoder = typeof TextDecoder !== "undefined" ? new TextDecoder("utf8") : undefined;

  function UTF8ArrayToString(heap, idx, maxBytesToRead) {
    var endIdx = idx + maxBytesToRead;
    var endPtr = idx;
    while (heap[endPtr] && !(endPtr >= endIdx)) ++endPtr;
    if (endPtr - idx > 16 && heap.subarray && UTF8Decoder) {
      return UTF8Decoder.decode(heap.subarray(idx, endPtr));
    } else {
      var str = "";
      while (idx < endPtr) {
        var u0 = heap[idx++];
        if (!(u0 & 128)) {
          str += String.fromCharCode(u0);
          continue;
        }
        var u1 = heap[idx++] & 63;
        if ((u0 & 224) == 192) {
          str += String.fromCharCode(((u0 & 31) << 6) | u1);
          continue;
        }
        var u2 = heap[idx++] & 63;
        if ((u0 & 240) == 224) {
          u0 = ((u0 & 15) << 12) | (u1 << 6) | u2;
        } else {
          u0 = ((u0 & 7) << 18) | (u1 << 12) | (u2 << 6) | (heap[idx++] & 63);
        }
        if (u0 < 65536) {
          str += String.fromCharCode(u0);
        } else {
          var ch = u0 - 65536;
          str += String.fromCharCode(55296 | (ch >> 10), 56320 | (ch & 1023));
        }
      }
    }
    return str;
  }

  function UTF8ToString(ptr, maxBytesToRead) {
    return ptr ? UTF8ArrayToString(HEAPU8, ptr, maxBytesToRead) : "";
  }

  function alignUp(x, multiple) {
    if (x % multiple > 0) {
      x += multiple - (x % multiple);
    }
    return x;
  }

  var buffer, HEAP8, HEAPU8, HEAP16, HEAPU16, HEAP32, HEAPU32, HEAPF32, HEAPF64;

  function updateGlobalBufferAndViews(buf) {
    buffer = buf;
    Module["HEAP8"] = HEAP8 = new Int8Array(buf);
    Module["HEAP16"] = HEAP16 = new Int16Array(buf);
    Module["HEAP32"] = HEAP32 = new Int32Array(buf);
    Module["HEAPU8"] = HEAPU8 = new Uint8Array(buf);
    Module["HEAPU16"] = HEAPU16 = new Uint16Array(buf);
    Module["HEAPU32"] = HEAPU32 = new Uint32Array(buf);
    Module["HEAPF32"] = HEAPF32 = new Float32Array(buf);
    Module["HEAPF64"] = HEAPF64 = new Float64Array(buf);
  }

  var INITIAL_MEMORY = Module["INITIAL_MEMORY"] || 16777216;

  var wasmTable;

  var __ATPRERUN__ = [];

  var __ATINIT__ = [];

  var __ATPOSTRUN__ = [];

  var runtimeInitialized = false;

  function preRun() {
    if (Module["preRun"]) {
      if (typeof Module["preRun"] == "function") Module["preRun"] = [Module["preRun"]];
      while (Module["preRun"].length) {
        addOnPreRun(Module["preRun"].shift());
      }
    }
    callRuntimeCallbacks(__ATPRERUN__);
  }

  function initRuntime() {
    runtimeInitialized = true;
    callRuntimeCallbacks(__ATINIT__);
  }

  function postRun() {
    if (Module["postRun"]) {
      if (typeof Module["postRun"] == "function") Module["postRun"] = [Module["postRun"]];
      while (Module["postRun"].length) {
        addOnPostRun(Module["postRun"].shift());
      }
    }
    callRuntimeCallbacks(__ATPOSTRUN__);
  }

  function addOnPreRun(cb) {
    __ATPRERUN__.unshift(cb);
  }

  function addOnInit(cb) {
    __ATINIT__.unshift(cb);
  }

  function addOnPostRun(cb) {
    __ATPOSTRUN__.unshift(cb);
  }

  var runDependencies = 0;

  var runDependencyWatcher = null;

  var dependenciesFulfilled = null;

  function addRunDependency(id) {
    runDependencies++;
    if (Module["monitorRunDependencies"]) {
      Module["monitorRunDependencies"](runDependencies);
    }
  }

  function removeRunDependency(id) {
    runDependencies--;
    if (Module["monitorRunDependencies"]) {
      Module["monitorRunDependencies"](runDependencies);
    }
    if (runDependencies == 0) {
      if (runDependencyWatcher !== null) {
        clearInterval(runDependencyWatcher);
        runDependencyWatcher = null;
      }
      if (dependenciesFulfilled) {
        var callback = dependenciesFulfilled;
        dependenciesFulfilled = null;
        callback();
      }
    }
  }

  Module["preloadedImages"] = {};

  Module["preloadedAudios"] = {};

  function abort(what) {
    if (Module["onAbort"]) {
      Module["onAbort"](what);
    }
    what += "";
    err(what);
    ABORT = true;
    EXITSTATUS = 1;
    what = "abort(" + what + "). Build with -s ASSERTIONS=1 for more info.";
    var e = new WebAssembly.RuntimeError(what);
    readyPromiseReject(e);
    throw e;
  }

  async function createWasm() {
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
        info,
      );
      return receiveInstance(result.instance);
    } catch (e) {
      try {
        abort(e);
      } catch (e) {
        readyPromiseReject(e);
      }
      err("Module.instantiateWasm callback failed with error: " + e);
      abort(e);
      return false;
    }
  }
  var tempDouble;

  var tempI64;

  var ASM_CONSTS = {
    35180: function () {
      return Module.getRandomValue();
    },
    35216: function () {
      if (Module.getRandomValue === undefined) {
        Module.getRandomValue = () => {
          var buf = new Uint32Array(1);
          crypto.getRandomValues(buf);
          return buf[0] >>> 0;
        };
      }
    },
  };

  function callRuntimeCallbacks(callbacks) {
    while (callbacks.length > 0) {
      var callback = callbacks.shift();
      if (typeof callback == "function") {
        callback(Module);
        continue;
      }
      var func = callback.func;
      if (typeof func === "number") {
        if (callback.arg === undefined) {
          wasmTable.get(func)();
        } else {
          wasmTable.get(func)(callback.arg);
        }
      } else {
        func(callback.arg === undefined ? null : callback.arg);
      }
    }
  }

  function ___assert_fail(condition, filename, line, func) {
    abort(
      "Assertion failed: " +
        UTF8ToString(condition) +
        ", at: " +
        [filename ? UTF8ToString(filename) : "unknown filename", line, func ? UTF8ToString(func) : "unknown function"],
    );
  }

  function _abort() {
    abort();
  }

  var readAsmConstArgsArray = [];

  function readAsmConstArgs(sigPtr, buf) {
    readAsmConstArgsArray.length = 0;
    var ch;
    buf >>= 2;
    while ((ch = HEAPU8[sigPtr++])) {
      var double = ch < 105;
      if (double && buf & 1) buf++;
      readAsmConstArgsArray.push(double ? HEAPF64[buf++ >> 1] : HEAP32[buf]);
      ++buf;
    }
    return readAsmConstArgsArray;
  }

  function _emscripten_asm_const_int(code, sigPtr, argbuf) {
    var args = readAsmConstArgs(sigPtr, argbuf);
    return ASM_CONSTS[code].apply(null, args);
  }

  function _emscripten_get_heap_max() {
    return 2147483648;
  }

  function _emscripten_memcpy_big(dest, src, num) {
    HEAPU8.copyWithin(dest, src, src + num);
  }

  function emscripten_realloc_buffer(size) {
    try {
      wasmMemory.grow((size - buffer.byteLength + 65535) >>> 16);
      updateGlobalBufferAndViews(wasmMemory.buffer);
      return 1;
    } catch (e) {}
  }

  function _emscripten_resize_heap(requestedSize) {
    var oldSize = HEAPU8.length;
    requestedSize = requestedSize >>> 0;
    var maxHeapSize = 2147483648;
    if (requestedSize > maxHeapSize) {
      return false;
    }
    for (var cutDown = 1; cutDown <= 4; cutDown *= 2) {
      var overGrownHeapSize = oldSize * (1 + 0.2 / cutDown);
      overGrownHeapSize = Math.min(overGrownHeapSize, requestedSize + 100663296);
      var newSize = Math.min(maxHeapSize, alignUp(Math.max(requestedSize, overGrownHeapSize), 65536));
      var replacement = emscripten_realloc_buffer(newSize);
      if (replacement) {
        return true;
      }
    }
    return false;
  }

  var asmLibraryArg = {
    b: ___assert_fail,
    c: _abort,
    a: _emscripten_asm_const_int,
    d: _emscripten_get_heap_max,
    e: _emscripten_memcpy_big,
    f: _emscripten_resize_heap,
  };

  var asm = createWasm();

  var ___wasm_call_ctors = (Module["___wasm_call_ctors"] = function () {
    return (___wasm_call_ctors = Module["___wasm_call_ctors"] = Module["asm"]["h"]).apply(null, arguments);
  });

  var _crypto_box_publickeybytes = (Module["_crypto_box_publickeybytes"] = function () {
    return (_crypto_box_publickeybytes = Module["_crypto_box_publickeybytes"] = Module["asm"]["i"]).apply(
      null,
      arguments,
    );
  });

  var _crypto_box_secretkeybytes = (Module["_crypto_box_secretkeybytes"] = function () {
    return (_crypto_box_secretkeybytes = Module["_crypto_box_secretkeybytes"] = Module["asm"]["j"]).apply(
      null,
      arguments,
    );
  });

  var _crypto_box_noncebytes = (Module["_crypto_box_noncebytes"] = function () {
    return (_crypto_box_noncebytes = Module["_crypto_box_noncebytes"] = Module["asm"]["k"]).apply(null, arguments);
  });

  var _crypto_box_macbytes = (Module["_crypto_box_macbytes"] = function () {
    return (_crypto_box_macbytes = Module["_crypto_box_macbytes"] = Module["asm"]["l"]).apply(null, arguments);
  });

  var _crypto_box_easy = (Module["_crypto_box_easy"] = function () {
    return (_crypto_box_easy = Module["_crypto_box_easy"] = Module["asm"]["m"]).apply(null, arguments);
  });

  var _crypto_box_open_easy = (Module["_crypto_box_open_easy"] = function () {
    return (_crypto_box_open_easy = Module["_crypto_box_open_easy"] = Module["asm"]["n"]).apply(null, arguments);
  });

  var _crypto_scalarmult_scalarbytes = (Module["_crypto_scalarmult_scalarbytes"] = function () {
    return (_crypto_scalarmult_scalarbytes = Module["_crypto_scalarmult_scalarbytes"] = Module["asm"]["o"]).apply(
      null,
      arguments,
    );
  });

  var _crypto_secretbox_keybytes = (Module["_crypto_secretbox_keybytes"] = function () {
    return (_crypto_secretbox_keybytes = Module["_crypto_secretbox_keybytes"] = Module["asm"]["p"]).apply(
      null,
      arguments,
    );
  });

  var _crypto_secretbox_noncebytes = (Module["_crypto_secretbox_noncebytes"] = function () {
    return (_crypto_secretbox_noncebytes = Module["_crypto_secretbox_noncebytes"] = Module["asm"]["q"]).apply(
      null,
      arguments,
    );
  });

  var _crypto_secretbox_macbytes = (Module["_crypto_secretbox_macbytes"] = function () {
    return (_crypto_secretbox_macbytes = Module["_crypto_secretbox_macbytes"] = Module["asm"]["r"]).apply(
      null,
      arguments,
    );
  });

  var _crypto_secretbox_easy = (Module["_crypto_secretbox_easy"] = function () {
    return (_crypto_secretbox_easy = Module["_crypto_secretbox_easy"] = Module["asm"]["s"]).apply(null, arguments);
  });

  var _crypto_secretbox_open_easy = (Module["_crypto_secretbox_open_easy"] = function () {
    return (_crypto_secretbox_open_easy = Module["_crypto_secretbox_open_easy"] = Module["asm"]["t"]).apply(
      null,
      arguments,
    );
  });

  var _crypto_sign_statebytes = (Module["_crypto_sign_statebytes"] = function () {
    return (_crypto_sign_statebytes = Module["_crypto_sign_statebytes"] = Module["asm"]["u"]).apply(null, arguments);
  });

  var _crypto_sign_bytes = (Module["_crypto_sign_bytes"] = function () {
    return (_crypto_sign_bytes = Module["_crypto_sign_bytes"] = Module["asm"]["v"]).apply(null, arguments);
  });

  var _crypto_sign_seedbytes = (Module["_crypto_sign_seedbytes"] = function () {
    return (_crypto_sign_seedbytes = Module["_crypto_sign_seedbytes"] = Module["asm"]["w"]).apply(null, arguments);
  });

  var _crypto_sign_publickeybytes = (Module["_crypto_sign_publickeybytes"] = function () {
    return (_crypto_sign_publickeybytes = Module["_crypto_sign_publickeybytes"] = Module["asm"]["x"]).apply(
      null,
      arguments,
    );
  });

  var _crypto_sign_secretkeybytes = (Module["_crypto_sign_secretkeybytes"] = function () {
    return (_crypto_sign_secretkeybytes = Module["_crypto_sign_secretkeybytes"] = Module["asm"]["y"]).apply(
      null,
      arguments,
    );
  });

  var _crypto_sign_messagebytes_max = (Module["_crypto_sign_messagebytes_max"] = function () {
    return (_crypto_sign_messagebytes_max = Module["_crypto_sign_messagebytes_max"] = Module["asm"]["z"]).apply(
      null,
      arguments,
    );
  });

  var _crypto_sign_seed_keypair = (Module["_crypto_sign_seed_keypair"] = function () {
    return (_crypto_sign_seed_keypair = Module["_crypto_sign_seed_keypair"] = Module["asm"]["A"]).apply(
      null,
      arguments,
    );
  });

  var _crypto_sign_keypair = (Module["_crypto_sign_keypair"] = function () {
    return (_crypto_sign_keypair = Module["_crypto_sign_keypair"] = Module["asm"]["B"]).apply(null, arguments);
  });

  var _crypto_sign = (Module["_crypto_sign"] = function () {
    return (_crypto_sign = Module["_crypto_sign"] = Module["asm"]["C"]).apply(null, arguments);
  });

  var _crypto_sign_open = (Module["_crypto_sign_open"] = function () {
    return (_crypto_sign_open = Module["_crypto_sign_open"] = Module["asm"]["D"]).apply(null, arguments);
  });

  var _crypto_sign_detached = (Module["_crypto_sign_detached"] = function () {
    return (_crypto_sign_detached = Module["_crypto_sign_detached"] = Module["asm"]["E"]).apply(null, arguments);
  });

  var _crypto_sign_verify_detached = (Module["_crypto_sign_verify_detached"] = function () {
    return (_crypto_sign_verify_detached = Module["_crypto_sign_verify_detached"] = Module["asm"]["F"]).apply(
      null,
      arguments,
    );
  });

  var _crypto_sign_init = (Module["_crypto_sign_init"] = function () {
    return (_crypto_sign_init = Module["_crypto_sign_init"] = Module["asm"]["G"]).apply(null, arguments);
  });

  var _crypto_sign_update = (Module["_crypto_sign_update"] = function () {
    return (_crypto_sign_update = Module["_crypto_sign_update"] = Module["asm"]["H"]).apply(null, arguments);
  });

  var _crypto_sign_final_create = (Module["_crypto_sign_final_create"] = function () {
    return (_crypto_sign_final_create = Module["_crypto_sign_final_create"] = Module["asm"]["I"]).apply(
      null,
      arguments,
    );
  });

  var _crypto_sign_final_verify = (Module["_crypto_sign_final_verify"] = function () {
    return (_crypto_sign_final_verify = Module["_crypto_sign_final_verify"] = Module["asm"]["J"]).apply(
      null,
      arguments,
    );
  });

  var _crypto_sign_ed25519_pk_to_curve25519 = (Module["_crypto_sign_ed25519_pk_to_curve25519"] = function () {
    return (_crypto_sign_ed25519_pk_to_curve25519 = Module["_crypto_sign_ed25519_pk_to_curve25519"] =
      Module["asm"]["K"]).apply(null, arguments);
  });

  var _crypto_sign_ed25519_sk_to_curve25519 = (Module["_crypto_sign_ed25519_sk_to_curve25519"] = function () {
    return (_crypto_sign_ed25519_sk_to_curve25519 = Module["_crypto_sign_ed25519_sk_to_curve25519"] =
      Module["asm"]["L"]).apply(null, arguments);
  });

  var _randombytes_random = (Module["_randombytes_random"] = function () {
    return (_randombytes_random = Module["_randombytes_random"] = Module["asm"]["M"]).apply(null, arguments);
  });

  var _randombytes_stir = (Module["_randombytes_stir"] = function () {
    return (_randombytes_stir = Module["_randombytes_stir"] = Module["asm"]["N"]).apply(null, arguments);
  });

  var _randombytes_uniform = (Module["_randombytes_uniform"] = function () {
    return (_randombytes_uniform = Module["_randombytes_uniform"] = Module["asm"]["O"]).apply(null, arguments);
  });

  var _randombytes_buf = (Module["_randombytes_buf"] = function () {
    return (_randombytes_buf = Module["_randombytes_buf"] = Module["asm"]["P"]).apply(null, arguments);
  });

  var _randombytes_buf_deterministic = (Module["_randombytes_buf_deterministic"] = function () {
    return (_randombytes_buf_deterministic = Module["_randombytes_buf_deterministic"] = Module["asm"]["Q"]).apply(
      null,
      arguments,
    );
  });

  var _randombytes_seedbytes = (Module["_randombytes_seedbytes"] = function () {
    return (_randombytes_seedbytes = Module["_randombytes_seedbytes"] = Module["asm"]["R"]).apply(null, arguments);
  });

  var _randombytes_close = (Module["_randombytes_close"] = function () {
    return (_randombytes_close = Module["_randombytes_close"] = Module["asm"]["S"]).apply(null, arguments);
  });

  var _randombytes = (Module["_randombytes"] = function () {
    return (_randombytes = Module["_randombytes"] = Module["asm"]["T"]).apply(null, arguments);
  });

  var _sodium_bin2hex = (Module["_sodium_bin2hex"] = function () {
    return (_sodium_bin2hex = Module["_sodium_bin2hex"] = Module["asm"]["U"]).apply(null, arguments);
  });

  var _sodium_hex2bin = (Module["_sodium_hex2bin"] = function () {
    return (_sodium_hex2bin = Module["_sodium_hex2bin"] = Module["asm"]["V"]).apply(null, arguments);
  });

  var _sodium_base64_encoded_len = (Module["_sodium_base64_encoded_len"] = function () {
    return (_sodium_base64_encoded_len = Module["_sodium_base64_encoded_len"] = Module["asm"]["W"]).apply(
      null,
      arguments,
    );
  });

  var _sodium_bin2base64 = (Module["_sodium_bin2base64"] = function () {
    return (_sodium_bin2base64 = Module["_sodium_bin2base64"] = Module["asm"]["X"]).apply(null, arguments);
  });

  var _sodium_base642bin = (Module["_sodium_base642bin"] = function () {
    return (_sodium_base642bin = Module["_sodium_base642bin"] = Module["asm"]["Y"]).apply(null, arguments);
  });

  var _sodium_init = (Module["_sodium_init"] = function () {
    return (_sodium_init = Module["_sodium_init"] = Module["asm"]["Z"]).apply(null, arguments);
  });

  var _sodium_pad = (Module["_sodium_pad"] = function () {
    return (_sodium_pad = Module["_sodium_pad"] = Module["asm"]["_"]).apply(null, arguments);
  });

  var _sodium_unpad = (Module["_sodium_unpad"] = function () {
    return (_sodium_unpad = Module["_sodium_unpad"] = Module["asm"]["$"]).apply(null, arguments);
  });

  var _sodium_version_string = (Module["_sodium_version_string"] = function () {
    return (_sodium_version_string = Module["_sodium_version_string"] = Module["asm"]["aa"]).apply(null, arguments);
  });

  var _sodium_library_version_major = (Module["_sodium_library_version_major"] = function () {
    return (_sodium_library_version_major = Module["_sodium_library_version_major"] = Module["asm"]["ba"]).apply(
      null,
      arguments,
    );
  });

  var _sodium_library_version_minor = (Module["_sodium_library_version_minor"] = function () {
    return (_sodium_library_version_minor = Module["_sodium_library_version_minor"] = Module["asm"]["ca"]).apply(
      null,
      arguments,
    );
  });

  var _sodium_library_minimal = (Module["_sodium_library_minimal"] = function () {
    return (_sodium_library_minimal = Module["_sodium_library_minimal"] = Module["asm"]["da"]).apply(null, arguments);
  });

  var _malloc = (Module["_malloc"] = function () {
    return (_malloc = Module["_malloc"] = Module["asm"]["ea"]).apply(null, arguments);
  });

  var _free = (Module["_free"] = function () {
    return (_free = Module["_free"] = Module["asm"]["fa"]).apply(null, arguments);
  });

  Module["setValue"] = setValue;

  Module["getValue"] = getValue;

  Module["UTF8ToString"] = UTF8ToString;

  var calledRun;

  dependenciesFulfilled = function runCaller() {
    if (!calledRun) run();
    if (!calledRun) dependenciesFulfilled = runCaller;
  };

  function run(args) {
    if (runDependencies > 0) {
      return;
    }
    preRun();
    if (runDependencies > 0) {
      return;
    }
    function doRun() {
      if (calledRun) return;
      calledRun = true;
      Module["calledRun"] = true;
      if (ABORT) return;
      initRuntime();
      readyPromiseResolve(Module);
      if (Module["onRuntimeInitialized"]) Module["onRuntimeInitialized"]();
      postRun();
    }
    if (Module["setStatus"]) {
      Module["setStatus"]("Running...");
      setTimeout(function () {
        setTimeout(function () {
          Module["setStatus"]("");
        }, 1);
        doRun();
      }, 1);
    } else {
      doRun();
    }
  }

  Module["run"] = run;

  if (Module["preInit"]) {
    if (typeof Module["preInit"] == "function") Module["preInit"] = [Module["preInit"]];
    while (Module["preInit"].length > 0) {
      Module["preInit"].pop()();
    }
  }

  run();

  return Module.ready;
};

export default libsodiumModule;
