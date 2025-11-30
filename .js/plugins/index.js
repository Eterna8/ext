"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var BelleRepository_1 = __importDefault(require("@plugins/english/BelleRepository"));
var ReadHive_1 = __importDefault(require("@plugins/english/ReadHive"));
var PLUGINS = [BelleRepository_1.default, ReadHive_1.default];
exports.default = PLUGINS;
