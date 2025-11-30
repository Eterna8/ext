"use strict";
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* global Buffer */
var fs = __importStar(require("fs"));
var path = __importStar(require("path"));
var image_size_1 = __importDefault(require("image-size"));
var size = 96;
var minSize = 16;
var skip = new Set([
    //custom icons
    'FWK.US',
    'RNRF',
    'ReN',
    'daonovel',
    'dragontea',
    'foxaholic',
    'kiniga',
    'lightnovelpubvip',
    'moonlightnovel',
    'mtl-novel',
    'mysticalmerries',
    'novelTL',
    'novelsparadise',
    'sektenovel',
    'sonicmtl',
    'translatinotaku',
    'warriorlegendtrad',
    'wuxiaworld.site',
]);
var folder = path.join('public', 'static');
var used = new Set([
    path.join(folder, 'coverNotAvailable.webp'),
    path.join(folder, 'siteNotAvailable.png'),
]);
var notAvailableImage = fs.readFileSync(path.join(folder, 'siteNotAvailable.png'));
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var plugin_path, plugins, language, _a, _b, _c, _i, plugin, _d, id, name_1, site, iconUrl, lang, customJS, customCSS, icon, image, imageSize, exist, dir, err_1;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                console.log('Loading plugins.json ⌛');
                plugin_path = path.join('.dist', 'plugins.json');
                if (!fs.existsSync(plugin_path)) {
                    console.log('❌', plugin_path, 'not found (run "npm run build:manifest" first)');
                    return [2 /*return*/];
                }
                plugins = JSON.parse(fs.readFileSync(plugin_path, 'utf-8'));
                console.log('\nDownloading icons ⌛');
                _a = plugins;
                _b = [];
                for (_c in _a)
                    _b.push(_c);
                _i = 0;
                _e.label = 1;
            case 1:
                if (!(_i < _b.length)) return [3 /*break*/, 9];
                _c = _b[_i];
                if (!(_c in _a)) return [3 /*break*/, 8];
                plugin = _c;
                _d = plugins[plugin], id = _d.id, name_1 = _d.name, site = _d.site, iconUrl = _d.iconUrl, lang = _d.lang, customJS = _d.customJS, customCSS = _d.customCSS;
                icon = iconUrl && path.join(folder, iconUrl.split('/static/')[1]);
                if (language !== lang) {
                    language = lang;
                    console.log(" ".concat(language, " ")
                        .padStart(Math.floor((language.length + 32) / 2), '=')
                        .padEnd(30, '='));
                }
                _e.label = 2;
            case 2:
                _e.trys.push([2, 6, , 8]);
                if (customJS) {
                    used.add(path.join(folder, customJS.split('/static/')[1]));
                }
                if (customCSS) {
                    used.add(path.join(folder, customCSS.split('/static/')[1]));
                }
                if (icon)
                    used.add(icon);
                if (!(!skip.has(id) && icon && site)) return [3 /*break*/, 4];
                return [4 /*yield*/, fetch("https://www.google.com/s2/favicons?domain=".concat(site, "&sz=").concat(size, "&type=png"))
                        .then(function (res) { return res.arrayBuffer(); })
                        .then(function (res) { return Buffer.from(res); })];
            case 3:
                image = _e.sent();
                if (Buffer.compare(image, notAvailableImage) === 0) {
                    console.log('  ', name_1.padEnd(26), "(".concat(id, ")").padEnd(20), 'Is site down?', '\r❌');
                    return [3 /*break*/, 8];
                }
                imageSize = (0, image_size_1.default)(image);
                exist = fs.existsSync(icon);
                if (!exist) {
                    dir = path.dirname(icon);
                    fs.mkdirSync(dir, { recursive: true });
                }
                if ((((imageSize === null || imageSize === void 0 ? void 0 : imageSize.width) || size) > minSize &&
                    ((imageSize === null || imageSize === void 0 ? void 0 : imageSize.height) || size) > minSize) ||
                    !exist) {
                    fs.writeFileSync(icon, image);
                    console.log('  ', name_1.padEnd(26), "(".concat(id, ")"), '\r✅');
                }
                else {
                    console.log('  ', name_1.padEnd(26), "(".concat(id, ")").padEnd(20), 'Low quality', '\r🔄');
                }
                return [3 /*break*/, 5];
            case 4:
                console.log('  ', "Skipping ".concat(name_1).padEnd(26), "(".concat(id, ")"), '\r🔄');
                _e.label = 5;
            case 5: return [3 /*break*/, 8];
            case 6:
                err_1 = _e.sent();
                console.log('  ', name_1.padEnd(26), "(".concat(id, ")").padEnd(20), err_1 instanceof Error ? err_1.constructor.name : typeof err_1, '\r❌');
                console.log(err_1);
                return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 2500); })];
            case 7:
                _e.sent();
                return [3 /*break*/, 8];
            case 8:
                _i++;
                return [3 /*break*/, 1];
            case 9:
                console.log('\nDeleting unused icons  ⌛');
                fileList(folder).forEach(function (path) {
                    if (!used.has(path)) {
                        console.log('🗑️', path);
                        fs.rmSync(path, { force: true });
                    }
                });
                console.log('\nDone ✅');
                return [2 /*return*/];
        }
    });
}); })();
function fileList(dir) {
    return fs.readdirSync(dir).reduce(function (list, file) {
        var name = path.join(dir, file);
        var isDir = fs.statSync(name).isDirectory();
        return list.concat(isDir ? fileList(name) : [name]);
    }, []);
}
