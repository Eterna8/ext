"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPlugin = exports.searchPlugins = void 0;
var index_1 = __importDefault(require("@plugins/index"));
var searchPlugins = function (keyword) {
    return index_1.default.filter(function (f) {
        return f.name.toLowerCase().includes(keyword.toLowerCase()) ||
            f.id.toLowerCase().includes(keyword.toLowerCase());
    });
};
exports.searchPlugins = searchPlugins;
var getPlugin = function (id) { return index_1.default.find(function (f) { return f.id === id; }); };
exports.getPlugin = getPlugin;
