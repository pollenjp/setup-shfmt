require('./sourcemap-register.js');/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 7242:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RETRY_COUNT = exports.CMD_NAME = exports.TOOL_CACHE_NAME = exports.OWNER = exports.REPO = void 0;
exports.REPO = 'sh';
exports.OWNER = 'mvdan';
exports.TOOL_CACHE_NAME = 'shfmt';
exports.CMD_NAME = 'shfmt';
exports.RETRY_COUNT = 3;


/***/ }),

/***/ 8422:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getGithubTokenInput = exports.getVersionInput = void 0;
// `@actions/core` v3+ is ESM-only, so it must be loaded via dynamic import to
// remain consumable from this CommonJS bundle (and from Jest).
const loadCore = async () => await __nccwpck_require__.e(/* import() */ 58).then(__nccwpck_require__.bind(__nccwpck_require__, 6058));
const getVersionInput = async () => {
    const core = await loadCore();
    return core.getInput('version');
};
exports.getVersionInput = getVersionInput;
const getGithubTokenInput = async () => {
    const core = await loadCore();
    return core.getInput('github-token');
};
exports.getGithubTokenInput = getGithubTokenInput;


/***/ }),

/***/ 1730:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.run = run;
const shfmt_1 = __nccwpck_require__(3461);
// `@actions/core` v3+ is ESM-only, so it must be loaded via dynamic import to
// remain consumable from this CommonJS bundle (and from Jest).
const loadCore = async () => await __nccwpck_require__.e(/* import() */ 58).then(__nccwpck_require__.bind(__nccwpck_require__, 6058));
/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
async function run() {
    try {
        await (0, shfmt_1.setupShfmt)();
    }
    catch (error) {
        // Fail the workflow run if an error occurs
        if (error instanceof Error) {
            const core = await loadCore();
            core.setFailed(error.message);
        }
    }
}


/***/ }),

/***/ 3461:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getDownloadBaseUrl = exports.setupShfmt = void 0;
const os = __importStar(__nccwpck_require__(857));
const inputs_1 = __nccwpck_require__(8422);
const constants_1 = __nccwpck_require__(7242);
const child_process_1 = __nccwpck_require__(5317);
// `@actions/core` v3+ and `@actions/tool-cache` v4+ are ESM-only, so they must
// be loaded via dynamic import to remain consumable from this CommonJS bundle
// (and from Jest).
const loadCore = async () => await __nccwpck_require__.e(/* import() */ 58).then(__nccwpck_require__.bind(__nccwpck_require__, 6058));
const loadToolCache = async () => await Promise.all(/* import() */[__nccwpck_require__.e(58), __nccwpck_require__.e(805)]).then(__nccwpck_require__.bind(__nccwpck_require__, 9805));
const setupShfmt = async () => {
    const core = await loadCore();
    const tc = await loadToolCache();
    const version = await getVersion(await (0, inputs_1.getVersionInput)());
    let toolPath = tc.find(constants_1.TOOL_CACHE_NAME, version, translateArchToDistArchName());
    if (toolPath) {
        core.info(`Found in cache @ ${toolPath}`);
    }
    else {
        const fileName = `${constants_1.TOOL_CACHE_NAME}_v${version}_${translateOsPlatformToDistPlatformName()}_${translateArchToDistArchName()}`;
        const downloadPath = await tc.downloadTool(`${(0, exports.getDownloadBaseUrl)(version)}/${fileName}${translateOsPlatformToDistPlatformName() === 'windows' ? '.exe' : ''}`);
        toolPath = await tc.cacheFile(downloadPath, constants_1.CMD_NAME, constants_1.TOOL_CACHE_NAME, version, translateArchToDistArchName());
        core.info(`Downloaded to ${toolPath}`);
    }
    // Add file permission to toolPath/CMD_NAME
    (0, child_process_1.exec)(`chmod +x "${toolPath}/${constants_1.CMD_NAME}"`);
    core.addPath(toolPath);
};
exports.setupShfmt = setupShfmt;
/**
 * Get the version of shfmt to download
 * @param version 'latest' or 'x.y.z'
 * @returns 'x.y.z'
 */
const getVersion = async (version) => {
    switch (version) {
        case 'latest': {
            const core = await loadCore();
            const githubTokenInput = await (0, inputs_1.getGithubTokenInput)();
            // curl -s https://api.github.com/repos/${OWNER}/${REPO}/releases/latest | jq -r '.tag_name'
            const response = await (async () => {
                for (let i = 0; i < constants_1.RETRY_COUNT; i++) {
                    try {
                        const res = await fetch(`https://api.github.com/repos/${constants_1.OWNER}/${constants_1.REPO}/releases/latest`, {
                            headers: githubTokenInput
                                ? {
                                    Authorization: `Bearer ${githubTokenInput}`
                                }
                                : undefined
                        });
                        if (res.status !== 200) {
                            throw new Error(`Fetching the latest release page (${res.statusText})`);
                        }
                        return res;
                    }
                    catch (error) {
                        core.warning(`${error.message} Retry... ${i + 1}/${constants_1.RETRY_COUNT}`);
                        await new Promise(resolve => setTimeout(resolve, 2000));
                    }
                }
                throw new Error(`Failed to get the latest version. If the reason is rate limit, please set the github-token. https://github.com/actions/runner-images/issues/602`);
            })();
            const releaseResponse = (await response.json());
            const tagName = releaseResponse.tag_name;
            if (typeof tagName !== 'string') {
                throw new Error('Failed to get the latest version of shfmt.');
            }
            return tagName.replace(/^v/, '');
        }
        default:
            return version;
    }
};
const getDownloadBaseUrl = (version) => {
    switch (version) {
        case 'latest':
            return new URL(`https://github.com/${constants_1.OWNER}/${constants_1.REPO}/releases/latest/download`);
        default:
            return new URL(`https://github.com/${constants_1.OWNER}/${constants_1.REPO}/releases/download/v${version}`);
    }
};
exports.getDownloadBaseUrl = getDownloadBaseUrl;
const translateOsPlatformToDistPlatformName = () => {
    switch (os.platform()) {
        case 'win32':
            return 'windows';
        case 'darwin':
            return 'darwin';
        case 'linux':
            return 'linux';
        default:
            throw new Error(`Unsupported platform: ${os.platform()}.`);
    }
};
/**
 *
 * os.arch(): 'arm', 'arm64', 'ia32', 'loong64', 'mips', 'mipsel', 'ppc', 'ppc64', 'riscv64', 's390', 's390x', and 'x64'
 * ->
 * shfmt_v3.10.0_darwin_amd64
 * shfmt_v3.10.0_darwin_arm64
 * shfmt_v3.10.0_linux_386
 * shfmt_v3.10.0_linux_amd64
 * shfmt_v3.10.0_linux_arm
 * shfmt_v3.10.0_linux_arm64
 * shfmt_v3.10.0_windows_386.exe
 * shfmt_v3.10.0_windows_amd64.exe
 *
 * @param arch
 * @returns
 */
const translateArchToDistArchName = () => {
    switch (os.arch()) {
        case 'x64':
            return 'amd64';
        case 'arm64':
            return 'arm64';
        case 'arm':
            return 'arm';
        case 'ia32':
            return '386';
        default:
            throw new Error(`Unsupported architecture: ${os.arch()}. Use go install instead.`);
    }
};


/***/ }),

/***/ 2613:
/***/ ((module) => {

module.exports = require("assert");

/***/ }),

/***/ 5317:
/***/ ((module) => {

module.exports = require("child_process");

/***/ }),

/***/ 6982:
/***/ ((module) => {

module.exports = require("crypto");

/***/ }),

/***/ 4434:
/***/ ((module) => {

module.exports = require("events");

/***/ }),

/***/ 9896:
/***/ ((module) => {

module.exports = require("fs");

/***/ }),

/***/ 8611:
/***/ ((module) => {

module.exports = require("http");

/***/ }),

/***/ 5692:
/***/ ((module) => {

module.exports = require("https");

/***/ }),

/***/ 9278:
/***/ ((module) => {

module.exports = require("net");

/***/ }),

/***/ 4589:
/***/ ((module) => {

module.exports = require("node:assert");

/***/ }),

/***/ 6698:
/***/ ((module) => {

module.exports = require("node:async_hooks");

/***/ }),

/***/ 4573:
/***/ ((module) => {

module.exports = require("node:buffer");

/***/ }),

/***/ 7540:
/***/ ((module) => {

module.exports = require("node:console");

/***/ }),

/***/ 7598:
/***/ ((module) => {

module.exports = require("node:crypto");

/***/ }),

/***/ 3053:
/***/ ((module) => {

module.exports = require("node:diagnostics_channel");

/***/ }),

/***/ 610:
/***/ ((module) => {

module.exports = require("node:dns");

/***/ }),

/***/ 8474:
/***/ ((module) => {

module.exports = require("node:events");

/***/ }),

/***/ 7067:
/***/ ((module) => {

module.exports = require("node:http");

/***/ }),

/***/ 2467:
/***/ ((module) => {

module.exports = require("node:http2");

/***/ }),

/***/ 7030:
/***/ ((module) => {

module.exports = require("node:net");

/***/ }),

/***/ 643:
/***/ ((module) => {

module.exports = require("node:perf_hooks");

/***/ }),

/***/ 1792:
/***/ ((module) => {

module.exports = require("node:querystring");

/***/ }),

/***/ 7075:
/***/ ((module) => {

module.exports = require("node:stream");

/***/ }),

/***/ 1692:
/***/ ((module) => {

module.exports = require("node:tls");

/***/ }),

/***/ 3136:
/***/ ((module) => {

module.exports = require("node:url");

/***/ }),

/***/ 7975:
/***/ ((module) => {

module.exports = require("node:util");

/***/ }),

/***/ 3429:
/***/ ((module) => {

module.exports = require("node:util/types");

/***/ }),

/***/ 5919:
/***/ ((module) => {

module.exports = require("node:worker_threads");

/***/ }),

/***/ 8522:
/***/ ((module) => {

module.exports = require("node:zlib");

/***/ }),

/***/ 857:
/***/ ((module) => {

module.exports = require("os");

/***/ }),

/***/ 6928:
/***/ ((module) => {

module.exports = require("path");

/***/ }),

/***/ 2203:
/***/ ((module) => {

module.exports = require("stream");

/***/ }),

/***/ 3193:
/***/ ((module) => {

module.exports = require("string_decoder");

/***/ }),

/***/ 3557:
/***/ ((module) => {

module.exports = require("timers");

/***/ }),

/***/ 4756:
/***/ ((module) => {

module.exports = require("tls");

/***/ }),

/***/ 9023:
/***/ ((module) => {

module.exports = require("util");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId].call(module.exports, module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__nccwpck_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/create fake namespace object */
/******/ 	(() => {
/******/ 		var getProto = Object.getPrototypeOf ? (obj) => (Object.getPrototypeOf(obj)) : (obj) => (obj.__proto__);
/******/ 		var leafPrototypes;
/******/ 		// create a fake namespace object
/******/ 		// mode & 1: value is a module id, require it
/******/ 		// mode & 2: merge all properties of value into the ns
/******/ 		// mode & 4: return value when already ns object
/******/ 		// mode & 16: return value when it's Promise-like
/******/ 		// mode & 8|1: behave like require
/******/ 		__nccwpck_require__.t = function(value, mode) {
/******/ 			if(mode & 1) value = this(value);
/******/ 			if(mode & 8) return value;
/******/ 			if(typeof value === 'object' && value) {
/******/ 				if((mode & 4) && value.__esModule) return value;
/******/ 				if((mode & 16) && typeof value.then === 'function') return value;
/******/ 			}
/******/ 			var ns = Object.create(null);
/******/ 			__nccwpck_require__.r(ns);
/******/ 			var def = {};
/******/ 			leafPrototypes = leafPrototypes || [null, getProto({}), getProto([]), getProto(getProto)];
/******/ 			for(var current = mode & 2 && value; typeof current == 'object' && !~leafPrototypes.indexOf(current); current = getProto(current)) {
/******/ 				Object.getOwnPropertyNames(current).forEach((key) => (def[key] = () => (value[key])));
/******/ 			}
/******/ 			def['default'] = () => (value);
/******/ 			__nccwpck_require__.d(ns, def);
/******/ 			return ns;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__nccwpck_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__nccwpck_require__.o(definition, key) && !__nccwpck_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/ensure chunk */
/******/ 	(() => {
/******/ 		__nccwpck_require__.f = {};
/******/ 		// This file contains only the entry chunk.
/******/ 		// The chunk loading function for additional chunks
/******/ 		__nccwpck_require__.e = (chunkId) => {
/******/ 			return Promise.all(Object.keys(__nccwpck_require__.f).reduce((promises, key) => {
/******/ 				__nccwpck_require__.f[key](chunkId, promises);
/******/ 				return promises;
/******/ 			}, []));
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/get javascript chunk filename */
/******/ 	(() => {
/******/ 		// This function allow to reference async chunks
/******/ 		__nccwpck_require__.u = (chunkId) => {
/******/ 			// return url for filenames based on template
/******/ 			return "" + chunkId + ".index.js";
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__nccwpck_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__nccwpck_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/******/ 	/* webpack/runtime/require chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded chunks
/******/ 		// "1" means "loaded", otherwise not loaded yet
/******/ 		var installedChunks = {
/******/ 			792: 1
/******/ 		};
/******/ 		
/******/ 		// no on chunks loaded
/******/ 		
/******/ 		var installChunk = (chunk) => {
/******/ 			var moreModules = chunk.modules, chunkIds = chunk.ids, runtime = chunk.runtime;
/******/ 			for(var moduleId in moreModules) {
/******/ 				if(__nccwpck_require__.o(moreModules, moduleId)) {
/******/ 					__nccwpck_require__.m[moduleId] = moreModules[moduleId];
/******/ 				}
/******/ 			}
/******/ 			if(runtime) runtime(__nccwpck_require__);
/******/ 			for(var i = 0; i < chunkIds.length; i++)
/******/ 				installedChunks[chunkIds[i]] = 1;
/******/ 		
/******/ 		};
/******/ 		
/******/ 		// require() chunk loading for javascript
/******/ 		__nccwpck_require__.f.require = (chunkId, promises) => {
/******/ 			// "1" is the signal for "already loaded"
/******/ 			if(!installedChunks[chunkId]) {
/******/ 				if(true) { // all chunks have JS
/******/ 					installChunk(require("./" + __nccwpck_require__.u(chunkId)));
/******/ 				} else installedChunks[chunkId] = 1;
/******/ 			}
/******/ 		};
/******/ 		
/******/ 		// no external install chunk
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it uses a non-standard name for the exports (exports).
(() => {
var exports = __webpack_exports__;

Object.defineProperty(exports, "__esModule", ({ value: true }));
/**
 * The entrypoint for the action.
 */
const main_1 = __nccwpck_require__(1730);
// eslint-disable-next-line @typescript-eslint/no-floating-promises
(0, main_1.run)();

})();

module.exports = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=index.js.map