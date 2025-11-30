"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = __importDefault(require("path"));
var fs_1 = __importDefault(require("fs"));
var languages_js_1 = __importDefault(require("./languages.js"));
var child_process_1 = require("child_process");
var terser_js_1 = require("./terser.js");
var REMOTE = (0, child_process_1.execSync)('git remote get-url origin')
    .toString()
    .replace(/[\s\n]/g, '');
var CURRENT_BRANCH = (0, child_process_1.execSync)('git branch --show-current')
    .toString()
    .replace(/[\s\n]/g, '');
var matched = REMOTE.match(/([^:/]+?)\/([^/.]+)(\.git)?$/);
if (!matched)
    throw Error('Cant parse git url');
var USERNAME = matched[1];
var REPO = matched[2];
var USER_CONTENT_LINK = process.env.USER_CONTENT_BASE
    ? process.env.USER_CONTENT_BASE
    : "https://raw.githubusercontent.com/".concat(USERNAME, "/").concat(REPO, "/").concat(CURRENT_BRANCH);
var STATIC_LINK = "".concat(USER_CONTENT_LINK, "/public/static");
// Use legacy .js/src/plugins path for backward compatibility
var PLUGIN_LINK = "".concat(USER_CONTENT_LINK, "/.js/src/plugins");
var DIST_DIR = '.dist';
var json = [];
if (!fs_1.default.existsSync(DIST_DIR)) {
    fs_1.default.mkdirSync(DIST_DIR);
}
var jsonPath = path_1.default.join(DIST_DIR, 'plugins.json');
var jsonMinPath = path_1.default.join(DIST_DIR, 'plugins.min.json');
var pluginSet = new Set();
var pluginsPerLanguage = {};
var pluginsWithFiltersPerLanguage = {};
var args = process.argv.slice(2);
var ONLY_NEW = args.includes('--only-new');
var existingPlugins = {};
if (!fs_1.default.existsSync(jsonPath))
    ONLY_NEW = false;
if (ONLY_NEW) {
    try {
        var existingJson = JSON.parse(fs_1.default.readFileSync(jsonPath, 'utf-8'));
        json = existingJson;
        for (var _i = 0, existingJson_1 = existingJson; _i < existingJson_1.length; _i++) {
            var plugin = existingJson_1[_i];
            existingPlugins[plugin.id] = plugin;
        }
    }
    catch (e) {
        console.warn('Failed to parse existing plugins.json:', e);
    }
}
// Simple semver comparison: "1.2.3" < "1.2.4"
function compareVersions(a, b) {
    var pa = a.split('.').map(Number);
    var pb = b.split('.').map(Number);
    for (var i = 0; i < Math.max(pa.length, pb.length); i++) {
        var na = pa[i] || 0;
        var nb = pb[i] || 0;
        if (na > nb)
            return 1;
        if (na < nb)
            return -1;
    }
    return 0;
}
var createRecursiveProxy = function () {
    var target = {};
    var handler = {
        get: function (target, prop) {
            if (prop === 'get') {
                return function (a) { return a; };
            }
            if (!target[prop]) {
                target[prop] = createRecursiveProxy();
            }
            return target[prop];
        },
    };
    return new Proxy(target, handler);
};
var proxy = createRecursiveProxy();
var _require = function () { return proxy; };
var COMPILED_PLUGIN_DIR = './.js/plugins';
var _loop_1 = function (language) {
    console.log(" ".concat(language, " ")
        .padStart(Math.floor((language.length + 32) / 2), '=')
        .padEnd(30, '='));
    var langPath = path_1.default.join(COMPILED_PLUGIN_DIR, language.toLowerCase());
    if (!fs_1.default.existsSync(langPath))
        return "continue";
    var plugins = fs_1.default.readdirSync(langPath);
    pluginsPerLanguage[language] = 0;
    pluginsWithFiltersPerLanguage[language] = 0;
    plugins.forEach(function (plugin) {
        if (plugin.startsWith('.'))
            return;
        (0, terser_js_1.minify)(path_1.default.join(langPath, plugin));
        var rawCode = fs_1.default.readFileSync("".concat(COMPILED_PLUGIN_DIR, "/").concat(language.toLowerCase(), "/").concat(plugin), 'utf-8');
        var instance = Function('require', 'module', "const exports = module.exports = {}; \n      ".concat(rawCode, "; \n      return exports.default"))(_require, {});
        var id = instance.id, name = instance.name, site = instance.site, version = instance.version, icon = instance.icon, customJS = instance.customJS, customCSS = instance.customCSS, filters = instance.filters;
        var normalisedName = name.replace(/\[.*\]/, '');
        // --only-new logic
        if (ONLY_NEW &&
            existingPlugins[id] &&
            compareVersions(existingPlugins[id].version, version) >= 0) {
            // console.log(`   Skipping ${name} (${id}) - not newer`, '\r🔁');
            return;
        }
        var info = {
            id: id,
            name: normalisedName,
            site: site,
            lang: languages_js_1.default[language],
            version: version,
            url: "".concat(PLUGIN_LINK, "/").concat(language.toLowerCase(), "/").concat(plugin),
            iconUrl: "".concat(STATIC_LINK, "/").concat(icon || 'siteNotAvailable.png'),
            customJS: customJS ? "".concat(STATIC_LINK, "/").concat(customJS) : undefined,
            customCSS: customCSS ? "".concat(STATIC_LINK, "/").concat(customCSS) : undefined,
        };
        if (pluginSet.has(id)) {
            console.log("There's already a plugin with id:", id);
            throw new Error('2 or more plugins have the same id');
        }
        else {
            pluginSet.add(id);
        }
        json.push(info);
        pluginsPerLanguage[language] += 1;
        if (filters !== undefined) {
            pluginsWithFiltersPerLanguage[language] += 1;
        }
        console.log('   ', name.padEnd(25), " (".concat(id, ")"), filters == undefined ? '\r✅' : '\r✅🔍');
    });
};
for (var language in languages_js_1.default) {
    _loop_1(language);
}
json.sort(function (a, b) {
    if (a.lang === b.lang)
        return a.id.localeCompare(b.id);
    return 0;
});
fs_1.default.writeFileSync(jsonMinPath, JSON.stringify(json));
fs_1.default.writeFileSync(jsonPath, JSON.stringify(json, null, '\t'));
var totalPlugins = Object.values(pluginsPerLanguage).reduce(function (a, b) { return a + b; }, 0);
if (!ONLY_NEW)
    fs_1.default.writeFileSync('total.svg', "\n    <svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" width=\"80\" height=\"20\" role=\"img\" aria-label=\"Plugins: ".concat(totalPlugins, "\">\n      <title>Plugins: ").concat(totalPlugins, "</title>\n      <linearGradient id=\"s\" x2=\"0\" y2=\"100%\">\n        <stop offset=\"0\" stop-color=\"#bbb\" stop-opacity=\".1\"/>\n        <stop offset=\"1\" stop-opacity=\".1\"/>\n      </linearGradient>\n      <clipPath id=\"r\">\n        <rect width=\"80\" height=\"20\" rx=\"3\" fill=\"#fff\"/>\n      </clipPath>\n      <g clip-path=\"url(#r)\">\n        <rect width=\"49\" height=\"20\" fill=\"#555\"/>\n        <rect x=\"49\" width=\"31\" height=\"20\" fill=\"#007ec6\"/>\n        <rect width=\"80\" height=\"20\" fill=\"url(#s)\"/>\n      </g>\n      <g fill=\"#fff\" text-anchor=\"middle\" font-family=\"Verdana,Geneva,DejaVu Sans,sans-serif\" text-rendering=\"geometricPrecision\" font-size=\"110\">\n        <text aria-hidden=\"true\" x=\"255\" y=\"150\" fill=\"#010101\" fill-opacity=\".3\" transform=\"scale(.1)\" textLength=\"390\">plugins</text>\n        <text x=\"255\" y=\"140\" transform=\"scale(.1)\" fill=\"#fff\" textLength=\"390\">plugins</text>\n        <text aria-hidden=\"true\" x=\"635\" y=\"150\" fill=\"#010101\" fill-opacity=\".3\" transform=\"scale(.1)\" textLength=\"210\">").concat(totalPlugins, "</text>\n        <text x=\"635\" y=\"140\" transform=\"scale(.1)\" fill=\"#fff\" textLength=\"210\">").concat(totalPlugins, "</text>\n      </g>\n    </svg>\n    "));
var _loop_2 = function (language) {
    var tsFiles = fs_1.default.readdirSync(path_1.default.join('./plugins', language.toLocaleLowerCase()));
    tsFiles
        .filter(function (f) { return f.endsWith('.broken.ts'); })
        .forEach(function (fn) {
        console.error(language.toLocaleLowerCase() +
            '/' +
            fn.replace('.broken.ts', '') +
            ' ❌');
    });
};
// check for broken plugins
for (var language in languages_js_1.default) {
    _loop_2(language);
}
console.log(jsonPath);
console.log('Done ✅');
var totalPluginsWithFilter = Object.values(pluginsWithFiltersPerLanguage).reduce(function (a, b) { return a + b; }, 0);
// Markdown table for GitHub Actions
console.warn('\n| Language | Plugins (With Filters) |');
console.warn('|----------|------------------------|');
for (var _a = 0, _b = Object.keys(languages_js_1.default); _a < _b.length; _a++) {
    var language = _b[_a];
    console.warn("| ".concat(language, " | ").concat(pluginsPerLanguage[language] || 0, " (").concat(pluginsWithFiltersPerLanguage[language] || 0, ") |"));
}
console.warn('|----------|------------------------|');
console.warn("| Total | ".concat(totalPlugins, " (").concat(totalPluginsWithFilter, ") |"));
