function e(e,t,n,r){Object.defineProperty(e,t,{get:n,set:r,enumerable:!0,configurable:!0})}var t="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{},n={},r={},s=t.parcelRequiree2f3;null==s&&((s=function(e){if(e in n)return n[e].exports;if(e in r){let t=r[e];delete r[e];let s={id:e,exports:{}};return n[e]=s,t.call(s.exports,s,s.exports),s.exports}var t=new Error("Cannot find module '"+e+"'");throw t.code="MODULE_NOT_FOUND",t}).register=function(e,t){r[e]=t},t.parcelRequiree2f3=s);var o=function(e={}){var t,n;e.ready=new Promise((function(e,r){t=e,n=r}));var r,s=e.printErr||console.warn.bind(console);"object"!=typeof WebAssembly&&S("no native wasm support detected");var o=!1;var a,i,_,u,c,p,y,l="undefined"!=typeof TextDecoder?new TextDecoder("utf8"):void 0;function d(e,t){return e?function(e,t,n){for(var r=t+n,s=t;e[s]&&!(s>=r);)++s;if(s-t>16&&e.subarray&&l)return l.decode(e.subarray(t,s));for(var o="";t<s;){var a=e[t++];if(128&a){var i=63&e[t++];if(192!=(224&a)){var _=63&e[t++];if((a=224==(240&a)?(15&a)<<12|i<<6|_:(7&a)<<18|i<<12|_<<6|63&e[t++])<65536)o+=String.fromCharCode(a);else{var u=a-65536;o+=String.fromCharCode(55296|u>>10,56320|1023&u)}}else o+=String.fromCharCode((31&a)<<6|i)}else o+=String.fromCharCode(a)}return o}(_,e,t):""}function b(t){a=t,e.HEAP8=i=new Int8Array(t),e.HEAP16=u=new Int16Array(t),e.HEAP32=c=new Int32Array(t),e.HEAPU8=_=new Uint8Array(t),e.HEAPU16=new Uint16Array(t),e.HEAPU32=new Uint32Array(t),e.HEAPF32=p=new Float32Array(t),e.HEAPF64=y=new Float64Array(t)}e.INITIAL_MEMORY;var g,f=[],m=[],h=[];var v,x,w=0,E=null,A=null;function S(t){e.onAbort&&e.onAbort(t),s(t+=""),o=!0,1,t="abort("+t+"). Build with -s ASSERTIONS=1 for more info.";var r=new WebAssembly.RuntimeError(t);throw n(r),r}e.preloadedImages={},e.preloadedAudios={};var k={35180:function(){return e.getRandomValue()},35216:function(){void 0===e.getRandomValue&&(e.getRandomValue=()=>{var e=new Uint32Array(1);return crypto.getRandomValues(e),e[0]>>>0})}};function R(t){for(;t.length>0;){var n=t.shift();if("function"!=typeof n){var r=n.func;"number"==typeof r?void 0===n.arg?g.get(r)():g.get(r)(n.arg):r(void 0===n.arg?null:n.arg)}else n(e)}}var I=[];function T(e){try{return r.grow(e-a.byteLength+65535>>>16),b(r.buffer),1}catch(e){}}var N,O={b:function(e,t,n,r){S("Assertion failed: "+d(e)+", at: "+[t?d(t):"unknown filename",n,r?d(r):"unknown function"])},c:function(){S()},a:function(e,t,n){var r=function(e,t){var n;for(I.length=0,t>>=2;n=_[e++];){var r=n<105;r&&1&t&&t++,I.push(r?y[t++>>1]:c[t]),++t}return I}(t,n);return k[e].apply(null,r)},d:function(){return 2147483648},e:function(e,t,n){_.copyWithin(e,t,t+n)},f:function(e){var t,n,r=_.length,s=2147483648;if((e>>>=0)>s)return!1;for(var o=1;o<=4;o*=2){var a=r*(1+.2/o);if(a=Math.min(a,e+100663296),T(Math.min(s,((t=Math.max(e,a))%(n=65536)>0&&(t+=n-t%n),t))))return!0}return!1}};(async function(){const t={a:O};function o(t){const n=t.exports;var s;return e.asm=n,b((r=n.g).buffer),g=n._,s=n.h,m.unshift(s),function(t){if(w--,e.monitorRunDependencies&&e.monitorRunDependencies(w),0==w&&(null!==E&&(clearInterval(E),E=null),A)){var n=A;A=null,n()}}(),n}w++,e.monitorRunDependencies&&e.monitorRunDependencies(w);try{if(e.instantiateWasm)return await e.instantiateWasm(t,o);o((await WebAssembly.instantiateStreaming(fetch("sodium.wasm",{credentials:"same-origin"}),t)).instance)}catch(e){try{S(e)}catch(e){n(e)}return s("Module.instantiateWasm callback failed with error: "+e),S(e),!1}})(),e.___wasm_call_ctors=function(){return(e.___wasm_call_ctors=e.asm.h).apply(null,arguments)},e._crypto_box_publickeybytes=function(){return(e._crypto_box_publickeybytes=e.asm.i).apply(null,arguments)},e._crypto_box_secretkeybytes=function(){return(e._crypto_box_secretkeybytes=e.asm.j).apply(null,arguments)},e._crypto_box_noncebytes=function(){return(e._crypto_box_noncebytes=e.asm.k).apply(null,arguments)},e._crypto_box_macbytes=function(){return(e._crypto_box_macbytes=e.asm.l).apply(null,arguments)},e._crypto_box_easy=function(){return(e._crypto_box_easy=e.asm.m).apply(null,arguments)},e._crypto_box_open_easy=function(){return(e._crypto_box_open_easy=e.asm.n).apply(null,arguments)},e._crypto_scalarmult_scalarbytes=function(){return(e._crypto_scalarmult_scalarbytes=e.asm.o).apply(null,arguments)},e._crypto_secretbox_keybytes=function(){return(e._crypto_secretbox_keybytes=e.asm.p).apply(null,arguments)},e._crypto_secretbox_noncebytes=function(){return(e._crypto_secretbox_noncebytes=e.asm.q).apply(null,arguments)},e._crypto_secretbox_macbytes=function(){return(e._crypto_secretbox_macbytes=e.asm.r).apply(null,arguments)},e._crypto_secretbox_easy=function(){return(e._crypto_secretbox_easy=e.asm.s).apply(null,arguments)},e._crypto_secretbox_open_easy=function(){return(e._crypto_secretbox_open_easy=e.asm.t).apply(null,arguments)},e._crypto_sign_statebytes=function(){return(e._crypto_sign_statebytes=e.asm.u).apply(null,arguments)},e._crypto_sign_bytes=function(){return(e._crypto_sign_bytes=e.asm.v).apply(null,arguments)},e._crypto_sign_seedbytes=function(){return(e._crypto_sign_seedbytes=e.asm.w).apply(null,arguments)},e._crypto_sign_publickeybytes=function(){return(e._crypto_sign_publickeybytes=e.asm.x).apply(null,arguments)},e._crypto_sign_secretkeybytes=function(){return(e._crypto_sign_secretkeybytes=e.asm.y).apply(null,arguments)},e._crypto_sign_messagebytes_max=function(){return(e._crypto_sign_messagebytes_max=e.asm.z).apply(null,arguments)},e._crypto_sign_seed_keypair=function(){return(e._crypto_sign_seed_keypair=e.asm.A).apply(null,arguments)},e._crypto_sign_keypair=function(){return(e._crypto_sign_keypair=e.asm.B).apply(null,arguments)},e._crypto_sign=function(){return(e._crypto_sign=e.asm.C).apply(null,arguments)},e._crypto_sign_open=function(){return(e._crypto_sign_open=e.asm.D).apply(null,arguments)},e._crypto_sign_detached=function(){return(e._crypto_sign_detached=e.asm.E).apply(null,arguments)},e._crypto_sign_verify_detached=function(){return(e._crypto_sign_verify_detached=e.asm.F).apply(null,arguments)},e._crypto_sign_init=function(){return(e._crypto_sign_init=e.asm.G).apply(null,arguments)},e._crypto_sign_update=function(){return(e._crypto_sign_update=e.asm.H).apply(null,arguments)},e._crypto_sign_final_create=function(){return(e._crypto_sign_final_create=e.asm.I).apply(null,arguments)},e._crypto_sign_final_verify=function(){return(e._crypto_sign_final_verify=e.asm.J).apply(null,arguments)},e._crypto_sign_ed25519_pk_to_curve25519=function(){return(e._crypto_sign_ed25519_pk_to_curve25519=e.asm.K).apply(null,arguments)},e._crypto_sign_ed25519_sk_to_curve25519=function(){return(e._crypto_sign_ed25519_sk_to_curve25519=e.asm.L).apply(null,arguments)},e._randombytes_random=function(){return(e._randombytes_random=e.asm.M).apply(null,arguments)},e._randombytes_stir=function(){return(e._randombytes_stir=e.asm.N).apply(null,arguments)},e._randombytes_uniform=function(){return(e._randombytes_uniform=e.asm.O).apply(null,arguments)},e._randombytes_buf=function(){return(e._randombytes_buf=e.asm.P).apply(null,arguments)},e._randombytes_buf_deterministic=function(){return(e._randombytes_buf_deterministic=e.asm.Q).apply(null,arguments)},e._randombytes_seedbytes=function(){return(e._randombytes_seedbytes=e.asm.R).apply(null,arguments)},e._randombytes_close=function(){return(e._randombytes_close=e.asm.S).apply(null,arguments)},e._randombytes=function(){return(e._randombytes=e.asm.T).apply(null,arguments)},e._sodium_bin2hex=function(){return(e._sodium_bin2hex=e.asm.U).apply(null,arguments)},e._sodium_hex2bin=function(){return(e._sodium_hex2bin=e.asm.V).apply(null,arguments)},e._sodium_base64_encoded_len=function(){return(e._sodium_base64_encoded_len=e.asm.W).apply(null,arguments)},e._sodium_bin2base64=function(){return(e._sodium_bin2base64=e.asm.X).apply(null,arguments)},e._sodium_base642bin=function(){return(e._sodium_base642bin=e.asm.Y).apply(null,arguments)},e._sodium_init=function(){return(e._sodium_init=e.asm.Z).apply(null,arguments)},e._sodium_pad=function(){return(e._sodium_pad=e.asm._).apply(null,arguments)},e._sodium_unpad=function(){return(e._sodium_unpad=e.asm.$).apply(null,arguments)},e._sodium_version_string=function(){return(e._sodium_version_string=e.asm.aa).apply(null,arguments)},e._sodium_library_version_major=function(){return(e._sodium_library_version_major=e.asm.ba).apply(null,arguments)},e._sodium_library_version_minor=function(){return(e._sodium_library_version_minor=e.asm.ca).apply(null,arguments)},e._sodium_library_minimal=function(){return(e._sodium_library_minimal=e.asm.da).apply(null,arguments)},e._malloc=function(){return(e._malloc=e.asm.ea).apply(null,arguments)},e._free=function(){return(e._free=e.asm.fa).apply(null,arguments)};function Y(n){function r(){N||(N=!0,e.calledRun=!0,o||(!0,R(m),t(e),e.onRuntimeInitialized&&e.onRuntimeInitialized(),function(){if(e.postRun)for("function"==typeof e.postRun&&(e.postRun=[e.postRun]);e.postRun.length;)t=e.postRun.shift(),h.unshift(t);var t;R(h)}()))}w>0||(!function(){if(e.preRun)for("function"==typeof e.preRun&&(e.preRun=[e.preRun]);e.preRun.length;)t=e.preRun.shift(),f.unshift(t);var t;R(f)}(),w>0||(e.setStatus?(e.setStatus("Running..."),setTimeout((function(){setTimeout((function(){e.setStatus("")}),1),r()}),1)):r()))}if(e.setValue=function(e,t,n,r){switch("*"===(n=n||"i8").charAt(n.length-1)&&(n="i32"),n){case"i1":case"i8":i[e>>0]=t;break;case"i16":u[e>>1]=t;break;case"i32":c[e>>2]=t;break;case"i64":x=[t>>>0,(v=t,+Math.abs(v)>=1?v>0?(0|Math.min(+Math.floor(v/4294967296),4294967295))>>>0:~~+Math.ceil((v-+(~~v>>>0))/4294967296)>>>0:0)],c[e>>2]=x[0],c[e+4>>2]=x[1];break;case"float":p[e>>2]=t;break;case"double":y[e>>3]=t;break;default:S("invalid type for setValue: "+n)}},e.getValue=function(e,t,n){switch("*"===(t=t||"i8").charAt(t.length-1)&&(t="i32"),t){case"i1":case"i8":return i[e>>0];case"i16":return u[e>>1];case"i32":case"i64":return c[e>>2];case"float":return p[e>>2];case"double":return y[e>>3];default:S("invalid type for getValue: "+t)}return null},e.UTF8ToString=d,A=function e(){N||Y(),N||(A=e)},e.run=Y,e.preInit)for("function"==typeof e.preInit&&(e.preInit=[e.preInit]);e.preInit.length>0;)e.preInit.pop()();return Y(),e.ready};s.register("2tmYq",(function(t,n){e(t.exports,"base64_variants",(()=>d)),e(t.exports,"crypto_sign_ed25519_pk_to_curve25519",(()=>L)),e(t.exports,"to_base64",(()=>m)),e(t.exports,"crypto_sign_keypair",(()=>j)),e(t.exports,"crypto_sign_seed_keypair",(()=>q)),e(t.exports,"randombytes_close",(()=>Z)),e(t.exports,"crypto_secretbox_open_easy",(()=>D)),e(t.exports,"crypto_sign_final_create",(()=>V)),e(t.exports,"to_string",(()=>p)),e(t.exports,"crypto_secretbox_easy",(()=>C)),e(t.exports,"crypto_sign_verify_detached",(()=>J)),e(t.exports,"randombytes_stir",(()=>ee)),e(t.exports,"crypto_sign_open",(()=>H)),e(t.exports,"randombytes_buf_deterministic",(()=>Q)),e(t.exports,"crypto_sign_ed25519_sk_to_curve25519",(()=>G)),e(t.exports,"randombytes_buf",(()=>X)),e(t.exports,"randombytes_uniform",(()=>te)),e(t.exports,"libsodium",(()=>r)),e(t.exports,"from_base64",(()=>f)),e(t.exports,"crypto_box_easy",(()=>B)),e(t.exports,"crypto_sign_init",(()=>W)),e(t.exports,"crypto_box_open_easy",(()=>K)),e(t.exports,"install",(()=>a)),e(t.exports,"crypto_sign_update",(()=>z)),e(t.exports,"CONSTANTS",(()=>U)),e(t.exports,"from_hex",(()=>y)),e(t.exports,"crypto_sign",(()=>M)),e(t.exports,"randombytes_random",(()=>$)),e(t.exports,"crypto_sign_detached",(()=>P)),e(t.exports,"sodium_version_string",(()=>ne)),e(t.exports,"from_string",(()=>u)),e(t.exports,"output_formats",(()=>h)),e(t.exports,"crypto_sign_final_verify",(()=>F)),e(t.exports,"to_hex",(()=>l));const r={};let s;const a=()=>s||(s=i()),i=async e=>{e&&(r.instantiateWasm=e.instantiateWasm),o(r),await r.ready;try{if(0!==r._sodium_init())throw new Error("libsodium was not correctly initialized.");const e=new Uint8Array([98,97,108,108,115]),t=X(U.crypto_secretbox_NONCEBYTES),n=X(U.crypto_secretbox_KEYBYTES),s=C(e,t,n);if(function(e,t){if(!(e instanceof Uint8Array&&t instanceof Uint8Array))throw new TypeError("Only Uint8Array instances can be compared");if(e.length!==t.length)throw new TypeError("Only instances of identical length can be compared");for(var n=0,r=0,s=e.length;r<s;r++)n|=e[r]^t[r];return 0===n}(e,D(s,t,n)))return}catch(e){throw console.log(e),new Error("./libsodium.js wasm failed to load"+e)}};const _=new TextEncoder,u=_.encode.bind(_),c=new TextDecoder("utf-8",{fatal:!0}),p=c.decode.bind(c);function y(e){const t=new A,n=O(t,e,"input"),s=new E(n.length/2),o=S(n),a=k(4);t.push(o),t.push(s.address),t.push(a),0!==r._sodium_hex2bin(s.address,s.length,o,n.length,0,0,a)&&I(t,"invalid input");r.getValue(a,"i32")-o!==n.length&&I(t,"incomplete input");const i=s.to_Uint8Array();return R(t),i}function l(e){e=O(null,e,"input");for(var t,n,r,s="",o=0;o<e.length;o++)r=87+(n=15&e[o])+(n-10>>8&-39)<<8|87+(t=e[o]>>>4)+(t-10>>8&-39),s+=String.fromCharCode(255&r)+String.fromCharCode(r>>>8);return s}var d,b;function g(e){if(null==e)return d.URLSAFE_NO_PADDING;if(e!==d.ORIGINAL&&e!==d.ORIGINAL_NO_PADDING&&e!==d.URLSAFE&&e!=d.URLSAFE_NO_PADDING)throw new Error("unsupported base64 variant");return e}function f(e,t){t=g(t);const n=new A,s=O(n,e,"input"),o=new E(3*s.length/4),a=S(s),i=k(4),_=k(4);n.push(a),n.push(o.address),n.push(i),n.push(_),0!==r._sodium_base642bin(o.address,o.length,a,s.length,0,i,_,t)&&I(n,"invalid input");r.getValue(_,"i32")-a!==s.length&&I(n,"incomplete input"),o.length=r.getValue(i,"i32");const u=o.to_Uint8Array();return R(n),u}function m(e,t){t=g(t);const n=new A;e=O(n,e,"input");const s=0|Math.floor(e.length/3),o=e.length-3*s,a=4*s+(0!==o?0==(2&t)?4:2+(o>>>1):0),i=new E(a+1),_=S(e);n.push(_),n.push(i.address),0===r._sodium_bin2base64(i.address,i.length,_,e.length,t)&&I(n,"conversion failed"),i.length=a;const u=p(i.to_Uint8Array());return R(n),u}(b=d||(d={}))[b.ORIGINAL=1]="ORIGINAL",b[b.ORIGINAL_NO_PADDING=3]="ORIGINAL_NO_PADDING",b[b.URLSAFE=5]="URLSAFE",b[b.URLSAFE_NO_PADDING=7]="URLSAFE_NO_PADDING";const h=Object.freeze(["uint8array","text","hex","base64"]);function v(e,t){var n=t||"uint8array";if(!x(n))throw new Error(n+" output format is not available");if(e instanceof E){if("uint8array"===n)return e.to_Uint8Array();if("text"===n)return p(e.to_Uint8Array());if("hex"===n)return l(e.to_Uint8Array());if("base64"===n)return m(e.to_Uint8Array(),d.URLSAFE_NO_PADDING);throw new Error('What is output format "'+n+'"?')}throw new TypeError("Cannot format output")}function x(e){return h.includes(e)}function w(e){if(e){if("string"!=typeof e)throw new TypeError("When defined, the output format must be a string");if(!x(e))throw new Error(e+" is not a supported output format")}}class E{to_Uint8Array(){var e=new Uint8Array(this.length);return e.set(r.HEAPU8.subarray(this.address,this.address+this.length)),e}constructor(e){this.length=e,this.address=k(e)}}class A extends Array{push(e){return this[this.length]=e}}function S(e){var t=k(e.length);return r.HEAPU8.set(e,t),t}function k(e){var t=r._malloc(e);if(0===t)throw{message:"_malloc() failed",length:e};return t}function R(e){if(e)for(var t=0;t<e.length;t++)n=e[t],r._free(n);var n}function I(e,t){throw R(e),new Error(t)}function T(e,t){throw R(e),new TypeError(t)}function N(e,t,n){null==t&&T(e,n+" cannot be null or undefined")}function O(e,t,n){return N(e,t,n),t instanceof Uint8Array?t:"string"==typeof t?u(t):void T(e,"unsupported input type for "+n)}const Y=(e,t)=>{Object.defineProperty(U,e,{value:t,writable:!1,configurable:!0,enumerable:!0})},U={get SODIUM_LIBRARY_VERSION_MAJOR(){const e=r._sodium_library_version_major();return Y("SODIUM_LIBRARY_VERSION_MAJOR",e),e},get SODIUM_LIBRARY_VERSION_MINOR(){const e=r._sodium_library_version_minor();return Y("SODIUM_LIBRARY_VERSION_MINOR",e),e},get SODIUM_VERSION_STRING(){const e=r._sodium_version_string();return Y("SODIUM_VERSION_STRING",e),e},get crypto_box_MACBYTES(){const e=r._crypto_box_macbytes();return Y("crypto_box_MACBYTES",e),e},get crypto_box_NONCEBYTES(){const e=r._crypto_box_noncebytes();return Y("crypto_box_NONCEBYTES",e),e},get crypto_box_PUBLICKEYBYTES(){const e=r._crypto_box_publickeybytes();return Y("crypto_box_PUBLICKEYBYTES",e),e},get crypto_box_SECRETKEYBYTES(){const e=r._crypto_box_secretkeybytes();return Y("crypto_box_SECRETKEYBYTES",e),e},get crypto_scalarmult_SCALARBYTES(){const e=r._crypto_scalarmult_scalarbytes();return Y("crypto_scalarmult_SCALARBYTES",e),e},get crypto_secretbox_KEYBYTES(){const e=r._crypto_secretbox_keybytes();return Y("crypto_secretbox_KEYBYTES",e),e},get crypto_secretbox_MACBYTES(){const e=r._crypto_secretbox_macbytes();return Y("crypto_secretbox_MACBYTES",e),e},get crypto_secretbox_NONCEBYTES(){const e=r._crypto_secretbox_noncebytes();return Y("crypto_secretbox_NONCEBYTES",e),e},get crypto_sign_BYTES(){const e=r._crypto_sign_bytes();return Y("crypto_sign_BYTES",e),e},get crypto_sign_MESSAGEBYTES_MAX(){const e=r._crypto_sign_messagebytes_max();return Y("crypto_sign_MESSAGEBYTES_MAX",e),e},get crypto_sign_PUBLICKEYBYTES(){const e=r._crypto_sign_publickeybytes();return Y("crypto_sign_PUBLICKEYBYTES",e),e},get crypto_sign_SECRETKEYBYTES(){const e=r._crypto_sign_secretkeybytes();return Y("crypto_sign_SECRETKEYBYTES",e),e},get crypto_sign_SEEDBYTES(){const e=r._crypto_sign_seedbytes();return Y("crypto_sign_SEEDBYTES",e),e}},B=(e,t,n,s,o="uint8array")=>{const a=new A;w(o);var i=S(e=O(a,e,"message")),_=e.length;a.push(i),t=O(a,t,"nonce");var u,c=0|r._crypto_box_noncebytes();t.length!==c&&T(a,"invalid nonce length"),u=S(t),a.push(u),n=O(a,n,"publicKey");var p,y=0|r._crypto_box_publickeybytes();n.length!==y&&T(a,"invalid publicKey length"),p=S(n),a.push(p),s=O(a,s,"privateKey");var l,d=0|r._crypto_box_secretkeybytes();s.length!==d&&T(a,"invalid privateKey length"),l=S(s),a.push(l);var b=_+r._crypto_box_macbytes()|0,g=new E(b),f=g.address;if(a.push(f),0==(0|r._crypto_box_easy(f,i,_,0,u,p,l))){var m=v(g,o);return R(a),m}I(a,"invalid usage")},K=(e,t,n,s,o="uint8array")=>{const a=new A;w(o),e=O(a,e,"ciphertext");var i,_=r._crypto_box_macbytes(),u=e.length;u<_&&T(a,"ciphertext is too short"),i=S(e),a.push(i),t=O(a,t,"nonce");var c,p=0|r._crypto_box_noncebytes();t.length!==p&&T(a,"invalid nonce length"),c=S(t),a.push(c),n=O(a,n,"publicKey");var y,l=0|r._crypto_box_publickeybytes();n.length!==l&&T(a,"invalid publicKey length"),y=S(n),a.push(y),s=O(a,s,"privateKey");var d,b=0|r._crypto_box_secretkeybytes();s.length!==b&&T(a,"invalid privateKey length"),d=S(s),a.push(d);var g=u-r._crypto_box_macbytes()|0,f=new E(g),m=f.address;if(a.push(m),0==(0|r._crypto_box_open_easy(m,i,u,0,c,y,d))){var h=v(f,o);return R(a),h}I(a,"incorrect key pair for the given ciphertext")},C=(e,t,n,s="uint8array")=>{const o=new A;w(s);var a=S(e=O(o,e,"message")),i=e.length;o.push(a),t=O(o,t,"nonce");var _,u=0|r._crypto_secretbox_noncebytes();t.length!==u&&T(o,"invalid nonce length"),_=S(t),o.push(_),n=O(o,n,"key");var c,p=0|r._crypto_secretbox_keybytes();n.length!==p&&T(o,"invalid key length"),c=S(n),o.push(c);var y=i+r._crypto_secretbox_macbytes()|0,l=new E(y),d=l.address;if(o.push(d),0==(0|r._crypto_secretbox_easy(d,a,i,0,_,c))){var b=v(l,s);return R(o),b}I(o,"invalid usage")},D=(e,t,n,s="uint8array")=>{const o=new A;w(s),e=O(o,e,"ciphertext");var a,i=r._crypto_secretbox_macbytes(),_=e.length;_<i&&T(o,"ciphertext is too short"),a=S(e),o.push(a),t=O(o,t,"nonce");var u,c=0|r._crypto_secretbox_noncebytes();t.length!==c&&T(o,"invalid nonce length"),u=S(t),o.push(u),n=O(o,n,"key");var p,y=0|r._crypto_secretbox_keybytes();n.length!==y&&T(o,"invalid key length"),p=S(n),o.push(p);var l=_-r._crypto_secretbox_macbytes()|0,d=new E(l),b=d.address;if(o.push(b),0==(0|r._crypto_secretbox_open_easy(b,a,_,0,u,p))){var g=v(d,s);return R(o),g}I(o,"wrong secret key for the given ciphertext")},M=(e,t,n="uint8array")=>{const s=new A;w(n);var o=S(e=O(s,e,"message")),a=e.length;s.push(o),t=O(s,t,"privateKey");var i,_=0|r._crypto_sign_secretkeybytes();t.length!==_&&T(s,"invalid privateKey length"),i=S(t),s.push(i);var u=e.length+r._crypto_sign_bytes()|0,c=new E(u),p=c.address;if(s.push(p),0==(0|r._crypto_sign(p,null,o,a,0,i))){var y=v(c,n);return R(s),y}I(s,"invalid usage")},P=(e,t,n="uint8array")=>{const s=new A;w(n);var o=S(e=O(s,e,"message")),a=e.length;s.push(o),t=O(s,t,"privateKey");var i,_=0|r._crypto_sign_secretkeybytes();t.length!==_&&T(s,"invalid privateKey length"),i=S(t),s.push(i);var u=0|r._crypto_sign_bytes(),c=new E(u),p=c.address;if(s.push(p),0==(0|r._crypto_sign_detached(p,null,o,a,0,i))){var y=v(c,n);return R(s),y}I(s,"invalid usage")},L=(e,t="uint8array")=>{const n=new A;w(t),e=O(n,e,"edPk");var s,o=0|r._crypto_sign_publickeybytes();e.length!==o&&T(n,"invalid edPk length"),s=S(e),n.push(s);var a=0|r._crypto_scalarmult_scalarbytes(),i=new E(a),_=i.address;if(n.push(_),0==(0|r._crypto_sign_ed25519_pk_to_curve25519(_,s))){var u=v(i,t);return R(n),u}I(n,"invalid key")},G=(e,t="uint8array")=>{const n=new A;w(t),e=O(n,e,"edSk");var s,o=0|r._crypto_sign_secretkeybytes();e.length!==o&&T(n,"invalid edSk length"),s=S(e),n.push(s);var a=0|r._crypto_scalarmult_scalarbytes(),i=new E(a),_=i.address;if(n.push(_),0==(0|r._crypto_sign_ed25519_sk_to_curve25519(_,s))){var u=v(i,t);return R(n),u}I(n,"invalid key")},V=(e,t,n="uint8array")=>{const s=new A;w(n),N(s,e,"state_address"),t=O(s,t,"privateKey");var o,a=0|r._crypto_sign_secretkeybytes();t.length!==a&&T(s,"invalid privateKey length"),o=S(t),s.push(o);var i=0|r._crypto_sign_bytes(),_=new E(i),u=_.address;if(s.push(u),0==(0|r._crypto_sign_final_create(e,u,null,o))){var c=(r._free(e),v(_,n));return R(s),c}I(s,"invalid usage")},F=(e,t,n,s="uint8array")=>{const o=new A;w(s),N(o,e,"state_address"),t=O(o,t,"signature");var a,i=0|r._crypto_sign_bytes();t.length!==i&&T(o,"invalid signature length"),a=S(t),o.push(a),n=O(o,n,"publicKey");var _,u=0|r._crypto_sign_publickeybytes();n.length!==u&&T(o,"invalid publicKey length"),_=S(n),o.push(_);var c=0===(0|r._crypto_sign_final_verify(e,a,_));return R(o),c},W=(e="uint8array")=>{const t=new A;w(e);var n=new E(208).address;if(0==(0|r._crypto_sign_init(n))){var s=n;return R(t),s}I(t,"internal error")},j=(e="uint8array")=>{const t=new A;w(e);var n=0|r._crypto_sign_publickeybytes(),s=new E(n),o=s.address;t.push(o);var a=0|r._crypto_sign_secretkeybytes(),i=new E(a),_=i.address;if(t.push(_),0==(0|r._crypto_sign_keypair(o,_))){var u={publicKey:v(s,e),privateKey:v(i,e),keyType:"ed25519"};return R(t),u}I(t,"internal error")},H=(e,t,n="uint8array")=>{const s=new A;w(n),e=O(s,e,"signedMessage");var o,a=r._crypto_sign_bytes(),i=e.length;i<a&&T(s,"signedMessage is too short"),o=S(e),s.push(o),t=O(s,t,"publicKey");var _,u=0|r._crypto_sign_publickeybytes();t.length!==u&&T(s,"invalid publicKey length"),_=S(t),s.push(_);var c=i-r._crypto_sign_bytes()|0,p=new E(c),y=p.address;if(s.push(y),0==(0|r._crypto_sign_open(y,null,o,i,0,_))){var l=v(p,n);return R(s),l}I(s,"incorrect signature for the given public key")},q=(e,t="uint8array")=>{const n=new A;w(t),e=O(n,e,"seed");var s,o=0|r._crypto_sign_seedbytes();e.length!==o&&T(n,"invalid seed length"),s=S(e),n.push(s);var a=0|r._crypto_sign_publickeybytes(),i=new E(a),_=i.address;n.push(_);var u=0|r._crypto_sign_secretkeybytes(),c=new E(u),p=c.address;if(n.push(p),0==(0|r._crypto_sign_seed_keypair(_,p,s))){var y={publicKey:v(i,t),privateKey:v(c,t),keyType:"ed25519"};return R(n),y}I(n,"invalid usage")},z=(e,t,n="uint8array")=>{const s=new A;w(n),N(s,e,"state_address");var o=S(t=O(s,t,"message_chunk")),a=t.length;s.push(o),0!=(0|r._crypto_sign_update(e,o,a,0))&&I(s,"invalid usage"),R(s)},J=(e,t,n)=>{const s=new A;e=O(s,e,"signature");var o,a=0|r._crypto_sign_bytes();e.length!==a&&T(s,"invalid signature length"),o=S(e),s.push(o);var i=S(t=O(s,t,"message")),_=t.length;s.push(i),n=O(s,n,"publicKey");var u,c=0|r._crypto_sign_publickeybytes();n.length!==c&&T(s,"invalid publicKey length"),u=S(n),s.push(u);var p=0===(0|r._crypto_sign_verify_detached(o,i,_,0,u));return R(s),p},X=(e,t="uint8array")=>{const n=new A;w(t),N(n,e,"length"),("number"!=typeof e||(0|e)!==e||e<0)&&T(n,"length must be an unsigned integer");var s=new E(0|e),o=s.address;n.push(o),r._randombytes_buf(o,e);var a=v(s,t);return R(n),a},Q=(e,t,n="uint8array")=>{const s=new A;w(n),N(s,e,"length"),("number"!=typeof e||(0|e)!==e||e<0)&&T(s,"length must be an unsigned integer"),t=O(s,t,"seed");var o,a=0|r._randombytes_seedbytes();t.length!==a&&T(s,"invalid seed length"),o=S(t),s.push(o);var i=new E(0|e),_=i.address;s.push(_),r._randombytes_buf_deterministic(_,e,o);var u=v(i,n);return R(s),u},Z=(e="uint8array")=>{new A;w(e),r._randombytes_close()},$=(e="uint8array")=>{const t=new A;w(e);var n=r._randombytes_random()>>>0;return R(t),n},ee=(e="uint8array")=>{new A;w(e),r._randombytes_stir()},te=(e,t="uint8array")=>{const n=new A;w(t),N(n,e,"upper_bound"),("number"!=typeof e||(0|e)!==e||e<0)&&T(n,"upper_bound must be an unsigned integer");var s=r._randombytes_uniform(e)>>>0;return R(n),s},ne=()=>{const e=new A;var t=r._sodium_version_string(),n=r.UTF8ToString(t);return R(e),n}}));var a,i,_=s("2tmYq");a=module.exports,i=_,Object.keys(i).forEach((function(e){"default"!==e&&"__esModule"!==e&&Object.defineProperty(a,e,{enumerable:!0,get:function(){return i[e]}})}));
//# sourceMappingURL=index.js.map