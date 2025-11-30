"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var fetch_1 = require("@libs/fetch");
var cheerio_1 = require("cheerio");
var defaultCover_1 = require("@libs/defaultCover");
var ReadHivePlugin = /** @class */ (function () {
    function ReadHivePlugin() {
        var _this = this;
        this.id = 'readhive';
        this.name = 'ReadHive';
        this.icon = 'src/en/readhive/FO721D5FA0CC7-02-scaled-e1658075230203-150x150.jpg';
        this.site = 'https://readhive.org';
        this.version = '2.0.0';
        this.filters = undefined;
        this.resolveUrl = function (path) {
            if (path.startsWith('http'))
                return path;
            return _this.site + (path.startsWith('/') ? path : '/' + path);
        };
    }
    ReadHivePlugin.prototype.popularNovels = function (pageNo, options) {
        return __awaiter(this, void 0, void 0, function () {
            var url, result, body, $, novels, processedPaths;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (pageNo > 1)
                            return [2 /*return*/, []];
                        url = this.site;
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url)];
                    case 1:
                        result = _a.sent();
                        return [4 /*yield*/, result.text()];
                    case 2:
                        body = _a.sent();
                        $ = (0, cheerio_1.load)(body);
                        novels = [];
                        processedPaths = new Set();
                        if (options.showLatestNovels) {
                            // Latest Updates section
                            $('h2:contains("Latest Updates")')
                                .next('.flex-wrap')
                                .find('.px-2.mb-4')
                                .each(function (i, el) {
                                var path = $(el).find('a.peer').attr('href');
                                if (path && !processedPaths.has(path)) {
                                    var name_1 = $(el).find('a.text-lg').text().trim();
                                    var cover = $(el).find('img').attr('src');
                                    if (cover && !cover.startsWith('http')) {
                                        cover = _this.resolveUrl(cover);
                                    }
                                    novels.push({ name: name_1, path: path, cover: cover || defaultCover_1.defaultCover });
                                    processedPaths.add(path);
                                }
                            });
                        }
                        else {
                            // Popular sections
                            $('h2:contains("Popular")')
                                .nextAll('.swiper')
                                .find('.swiper-slide')
                                .each(function (i, el) {
                                var path = $(el).find('a').attr('href');
                                if (path && !processedPaths.has(path)) {
                                    var name_2 = $(el).find('h6').text().trim();
                                    var cover = $(el).find('img').attr('src');
                                    if (cover && !cover.startsWith('http')) {
                                        cover = _this.resolveUrl(cover);
                                    }
                                    novels.push({ name: name_2, path: path, cover: cover || defaultCover_1.defaultCover });
                                    processedPaths.add(path);
                                }
                            });
                        }
                        return [2 /*return*/, novels];
                }
            });
        });
    };
    ReadHivePlugin.prototype.searchNovels = function (searchTerm, pageNo) {
        return __awaiter(this, void 0, void 0, function () {
            var url, result, body, $;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = "".concat(this.site, "/?s=").concat(searchTerm, "&page=").concat(pageNo);
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url)];
                    case 1:
                        result = _a.sent();
                        return [4 /*yield*/, result.text()];
                    case 2:
                        body = _a.sent();
                        $ = (0, cheerio_1.load)(body);
                        return [2 /*return*/, $('div.col-6.col-md-3.mb-4')
                                .map(function (i, el) {
                                var path = $(el).find('a').attr('href');
                                if (!path)
                                    return null;
                                var name = $(el).find('h5').text().trim();
                                var cover = $(el).find('img').attr('src');
                                if (cover && !cover.startsWith('http')) {
                                    cover = _this.resolveUrl(cover);
                                }
                                return { name: name, path: path, cover: cover || defaultCover_1.defaultCover };
                            })
                                .get()
                                .filter(Boolean)];
                }
            });
        });
    };
    ReadHivePlugin.prototype.parseNovel = function (novelPath) {
        return __awaiter(this, void 0, void 0, function () {
            var url, result, body, $, name, cover, novel, chapterElements, chapters;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = this.resolveUrl(novelPath);
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url)];
                    case 1:
                        result = _a.sent();
                        return [4 /*yield*/, result.text()];
                    case 2:
                        body = _a.sent();
                        $ = (0, cheerio_1.load)(body);
                        name = $('h1[class*="text-2xl"]').first().text().trim();
                        cover = $('img[alt*="Cover"]').attr('src') ||
                            $('img[alt*="Thumbnail"]').attr('src') ||
                            defaultCover_1.defaultCover;
                        novel = {
                            path: novelPath,
                            name: name,
                            cover: this.resolveUrl(cover),
                            author: $('span.leading-7').text().trim(),
                            summary: $('h2:contains("Synopsis")').next('div').find('p').text().trim(),
                            genres: $('div.flex-wrap a[href*="/genre/"]')
                                .map(function (i, el) { return $(el).text(); })
                                .get()
                                .join(', '),
                            chapters: [],
                        };
                        chapterElements = $('div[x-show="tab === \'releases\'"]').find('a[href*="/series/"]');
                        chapters = chapterElements
                            .map(function (i, el) {
                            var path = $(el).attr('href');
                            if (!path)
                                return null;
                            var chapterName = $(el).find('span.ml-1').text().trim();
                            var releaseTime = $(el).find('span.text-xs').text().trim();
                            return {
                                name: chapterName,
                                path: path.replace(_this.site, ''),
                                releaseTime: releaseTime,
                            };
                        })
                            .get()
                            .filter(Boolean);
                        novel.chapters = chapters;
                        return [2 /*return*/, novel];
                }
            });
        });
    };
    ReadHivePlugin.prototype.parseChapter = function (chapterPath) {
        return __awaiter(this, void 0, void 0, function () {
            var url, result, body, $, content;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = this.resolveUrl(chapterPath);
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url)];
                    case 1:
                        result = _a.sent();
                        return [4 /*yield*/, result.text()];
                    case 2:
                        body = _a.sent();
                        $ = (0, cheerio_1.load)(body);
                        content = $('div[class*="lg:grid-in-content"] div[style*="font-size"]');
                        content.find('div[data-fuse]').remove();
                        content.find('div.socials').remove();
                        content.find('div.reader-settings').remove();
                        content.find('div.nav-wrapper').remove();
                        content.find('p:contains("• • •")').remove();
                        content.find('p').each(function (i, el) {
                            var _a, _b;
                            if (((_a = $(el).html()) === null || _a === void 0 ? void 0 : _a.trim()) === '&nbsp;' || ((_b = $(el).html()) === null || _b === void 0 ? void 0 : _b.trim()) === '') {
                                $(el).remove();
                            }
                        });
                        return [2 /*return*/, content.html() || ''];
                }
            });
        });
    };
    return ReadHivePlugin;
}());
exports.default = new ReadHivePlugin();
