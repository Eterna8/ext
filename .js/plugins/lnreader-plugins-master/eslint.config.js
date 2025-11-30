"use strict";
// @ts-check
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var js_1 = __importDefault(require("@eslint/js"));
var eslint_config_prettier_1 = __importDefault(require("eslint-config-prettier"));
var typescript_eslint_1 = __importDefault(require("typescript-eslint"));
var globals_1 = __importDefault(require("globals"));
var globalsHermes = [
    //hermes@0.72
    'AggregateError',
    'Array',
    'ArrayBuffer',
    'BigInt',
    'BigInt64Array',
    'BigUint64Array',
    'Boolean',
    'DataView',
    'Date',
    'DebuggerInternal',
    'Error',
    'EvalError',
    'Float32Array',
    'Float64Array',
    'Function',
    'HermesInternal',
    'Infinity',
    'Int16Array',
    'Int32Array',
    'Int8Array',
    'JSON',
    'Map',
    'Math',
    'NaN',
    'Number',
    'Object',
    'Promise',
    'Proxy',
    'QuitError',
    'RangeError',
    'ReferenceError',
    'Reflect',
    'RegExp',
    'Set',
    'String',
    'Symbol',
    'SyntaxError',
    'TimeoutError',
    'TypeError',
    'URIError',
    'Uint16Array',
    'Uint32Array',
    'Uint8Array',
    'Uint8ClampedArray',
    'WeakMap',
    'WeakSet',
    '__defineGetter__',
    '__defineSetter__',
    '__lookupGetter__',
    '__lookupSetter__',
    '__proto__',
    'clearTimeout',
    'constructor',
    'createHeapSnapshot',
    'decodeURI',
    'decodeURIComponent',
    'encodeURI',
    'encodeURIComponent',
    'escape',
    'gc',
    'globalThis',
    'hasOwnProperty',
    'isFinite',
    'isNaN',
    'isPrototypeOf',
    'loadSegment',
    'parseFloat',
    'parseInt',
    'print',
    'propertyIsEnumerable',
    'setImmediate',
    'setTimeout',
    'toLocaleString',
    'toString',
    'undefined',
    'unescape',
    'valueOf',
    //react-native
    'AbortController',
    'Blob',
    'ErrorUtils',
    'Event',
    'EventTarget',
    'File',
    'FileReader',
    'FormData',
    'Headers',
    'Intl',
    'URL',
    'URLSearchParams',
    'WebSocket',
    'XMLHttpRequest',
    '__DEV__',
    '__dirname',
    '__fbBatchedBridgeConfig',
    'alert',
    'cancelAnimationFrame',
    'cancelIdleCallback',
    'clearImmediate',
    'clearInterval',
    'console',
    'document',
    'exports',
    'fetch',
    'global',
    'module',
    'navigator',
    'process',
    'queueMicrotask',
    'requestAnimationFrame',
    'requestIdleCallback',
    'require',
    'setInterval',
    'window',
].map(function (key) {
    var _a;
    return (_a = {}, _a[key] = 'readonly', _a);
});
exports.default = typescript_eslint_1.default.config.apply(typescript_eslint_1.default, __spreadArray(__spreadArray(__spreadArray([js_1.default.configs.recommended], typescript_eslint_1.default.configs.recommended, false), typescript_eslint_1.default.configs.stylistic, false), [eslint_config_prettier_1.default,
    {
        ignores: [
            '.js',
            'docs',
            'proxy_server.js',
            'plugins/*/*\\[*\\]*.ts', // Files with square brackets in their names
        ],
    },
    {
        files: ['./plugins/*/*.ts', './plugins/multisrc/*/template.ts'],
        rules: {
            'no-unused-vars': 'off',
            '@typescript-eslint/no-unused-vars': 'warn',
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/ban-ts-comment': 'off',
            '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
            'no-case-declarations': 'warn',
            'no-undef': 'error',
            'no-restricted-imports': [
                'error',
                {
                    patterns: [
                        {
                            group: ['@/lib/fetch*'],
                            message: 'Use @libs/fetch instead of @/lib/fetch',
                        },
                    ],
                },
            ],
        },
        languageOptions: {
            ecmaVersion: 5,
            sourceType: 'module',
            globals: Object.assign.apply(Object, __spreadArray([{}], globalsHermes, false)),
        },
    },
    {
        files: ['**/*.{ts,tsx,mts,cts,js}'],
        ignores: ['./plugins/*/*.ts', './plugins/multisrc/*/template.ts'],
        rules: {
            'no-unused-vars': 'off',
            '@typescript-eslint/no-unused-vars': 'warn',
            '@typescript-eslint/no-namespace': 'off',
            '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/ban-ts-comment': 'off',
            'no-undef': 'error',
            'no-restricted-imports': [
                'error',
                {
                    patterns: [
                        {
                            group: ['@/lib/fetch*'],
                            message: 'Use @libs/fetch instead of @/lib/fetch',
                        },
                    ],
                },
            ],
        },
        languageOptions: {
            globals: __assign(__assign({}, globals_1.default.serviceworker), globals_1.default.browser),
        },
    }], false));
