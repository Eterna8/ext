"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var dilartube_1 = __importDefault(require("@plugins/arabic/dilartube"));
var rewayatclub_1 = __importDefault(require("@plugins/arabic/rewayatclub"));
var sunovels_1 = __importDefault(require("@plugins/arabic/sunovels"));
var BelleRepository_1 = __importDefault(require("@plugins/english/BelleRepository"));
var ReadHive_1 = __importDefault(require("@plugins/english/ReadHive"));
var PLUGINS = [dilartube_1.default, rewayatclub_1.default, sunovels_1.default, BelleRepository_1.default, ReadHive_1.default];
exports.default = PLUGINS;
