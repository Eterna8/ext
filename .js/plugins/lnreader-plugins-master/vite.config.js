"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var vite_1 = require("vite");
var plugin_react_swc_1 = __importDefault(require("@vitejs/plugin-react-swc"));
var vite_plugin_node_polyfills_1 = require("vite-plugin-node-polyfills");
var path_1 = __importDefault(require("path"));
var url_1 = require("url");
var vite_2 = __importDefault(require("@tailwindcss/vite"));
var proxy_1 = require("./proxy");
var dirname = path_1.default.dirname((0, url_1.fileURLToPath)(import.meta.url));
// https://vitejs.dev/config/
exports.default = (0, vite_1.defineConfig)({
    plugins: [
        (0, vite_2.default)(),
        (0, vite_plugin_node_polyfills_1.nodePolyfills)(),
        (0, plugin_react_swc_1.default)({ devTarget: 'es5' }),
        {
            name: 'proxy',
            configureServer: function (server) {
                server.middlewares.use('/settings', proxy_1.proxySettingMiddleware);
                server.middlewares.use('/https:', proxy_1.proxyHandlerMiddle);
            },
        },
    ],
    resolve: {
        alias: {
            '@': path_1.default.resolve(dirname, './src'),
            '@plugins': path_1.default.resolve(dirname, './plugins'),
            '@libs': path_1.default.resolve(dirname, './src/libs'),
        },
    },
    server: {
        port: 3000,
        open: true,
    },
});
