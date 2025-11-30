"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var child_process_1 = require("child_process");
var content = "import { Plugin } from '@/types/plugin';\n";
var pluginCounter = 0;
var PLUGIN_DIR = 'plugins';
fs_1.default.readdirSync(PLUGIN_DIR)
    .filter(function (f) { return !f.includes('index') && f !== 'multisrc'; })
    .forEach(function (langName) {
    var LANG_DIR = PLUGIN_DIR + '/' + langName;
    fs_1.default.readdirSync(LANG_DIR)
        .filter(function (f) { return !f.includes('broken') && !f.startsWith('.'); })
        .forEach(function (pluginName) {
        content += "import p_".concat(pluginCounter, " from '@plugins/").concat(langName, "/").concat(pluginName.replace(/\.ts$/, ''), "';\n");
        pluginCounter += 1;
    });
});
content += "\nconst PLUGINS: Plugin.PluginBase[] = [".concat(Array(pluginCounter)
    .fill()
    .map(function (v, index) { return 'p_' + index.toString(); })
    .join(', '), "];\nexport default PLUGINS");
var outputPath = './plugins/index.ts';
fs_1.default.writeFileSync(outputPath, content, { encoding: 'utf-8' });
(0, child_process_1.execSync)("npx prettier --write ".concat(outputPath), { stdio: 'inherit' });
