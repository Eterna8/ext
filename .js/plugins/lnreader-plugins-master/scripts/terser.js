"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.minify = void 0;
var terser_1 = require("terser");
var fs_1 = __importDefault(require("fs"));
var config = {
    compress: {
        arrows: false,
    },
    mangle: {},
    ecma: 5, // specify one of: 5, 2015, 2016, etc.
    enclose: false, // or specify true, or "args:values"
    module: true,
    toplevel: true,
};
var minify = function (path) {
    var code = fs_1.default.readFileSync(path).toString();
    var result = (0, terser_1.minify_sync)(code, config);
    fs_1.default.writeFileSync(path, result.code);
};
exports.minify = minify;
