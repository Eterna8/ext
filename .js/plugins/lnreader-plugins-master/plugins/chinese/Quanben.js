"use strict";
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
var filterInputs_1 = require("@libs/filterInputs");
var fetch_1 = require("@libs/fetch");
var novelStatus_1 = require("@libs/novelStatus");
var cheerio_1 = require("cheerio");
var defaultCover_1 = require("@libs/defaultCover");
var parseUrl = function (url) {
    if (!url)
        return undefined;
    try {
        return new URL(url, 'https://www.quanben.io');
    }
    catch (_a) {
        return undefined;
    }
};
var getStandardNovelPath = function (url) {
    var parsedUrl = parseUrl(url);
    if (!parsedUrl)
        return undefined;
    var match = parsedUrl.pathname.match(/^(\/amp)?(\/n\/[^\/]+\/)/);
    return match === null || match === void 0 ? void 0 : match[2];
};
var getChapterFileName = function (url) {
    var parsedUrl = parseUrl(url);
    if (!parsedUrl)
        return undefined;
    var fileName = parsedUrl.pathname.split('/').pop();
    if (fileName && /^\d+\.html$/.test(fileName))
        return fileName;
    return undefined;
};
var makeAbsolute = function (relativeUrl, baseUrl) {
    if (!relativeUrl || !baseUrl)
        return undefined;
    try {
        if (relativeUrl.startsWith('//'))
            return 'https:' + relativeUrl;
        if (/^https?:\/\//.test(relativeUrl))
            return relativeUrl;
        return new URL(relativeUrl, baseUrl).href;
    }
    catch (_a) {
        return undefined;
    }
};
var QuanbenPlugin = /** @class */ (function () {
    function QuanbenPlugin() {
        this.id = 'quanben';
        this.name = 'Quanben';
        this.site = 'https://www.quanben.io/';
        this.version = '1.0.1';
        this.icon = 'src/cn/quanben/icon.png';
        this.defaultCover = defaultCover_1.defaultCover;
        // filters
        this.filters = {
            genre: {
                label: '分类',
                value: 'all',
                options: [
                    { label: '全部', value: 'all' },
                    { label: '玄幻', value: 'xuanhuan' },
                    { label: '都市', value: 'dushi' },
                    { label: '言情', value: 'yanqing' },
                    { label: '穿越', value: 'chuanyue' },
                    { label: '青春', value: 'qingchun' },
                    { label: '仙侠', value: 'xianxia' },
                    { label: '灵异', value: 'lingyi' },
                    { label: '悬疑', value: 'xuanyi' },
                    { label: '历史', value: 'lishi' },
                    { label: '军事', value: 'junshi' },
                    { label: '游戏', value: 'youxi' },
                    { label: '竞技', value: 'jingji' },
                    { label: '科幻', value: 'kehuan' },
                    { label: '职场', value: 'zhichang' },
                    { label: '官场', value: 'guanchang' },
                    { label: '现言', value: 'xianyan' },
                    { label: '耽美', value: 'danmei' },
                    { label: '其它', value: 'qita' },
                ],
                type: filterInputs_1.FilterTypes.Picker,
            },
        };
    }
    // homepage, when you first open the extension (with the applied filters if any)
    QuanbenPlugin.prototype.popularNovels = function (_pageNo_1, _a) {
        return __awaiter(this, arguments, void 0, function (_pageNo, _b) {
            var url, res, $, _c, novels;
            var _this = this;
            var filters = _b.filters;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        url = filters.genre.value === 'all'
                            ? this.site
                            : "".concat(this.site, "c/").concat(filters.genre.value, ".html");
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url)];
                    case 1:
                        res = _d.sent();
                        if (!res.ok)
                            throw new Error("[Quanben] Failed to fetch: ".concat(url, " - ").concat(res.status));
                        _c = cheerio_1.load;
                        return [4 /*yield*/, res.text()];
                    case 2:
                        $ = _c.apply(void 0, [_d.sent()]);
                        novels = [];
                        $('div.list2').each(function (_i, list2) {
                            var _a, _b, _c;
                            var $list2 = $(list2);
                            var $link = $list2.find('h3 > a').first();
                            var href = (_a = $link.attr('href')) === null || _a === void 0 ? void 0 : _a.trim();
                            var name = $link.text().trim();
                            var rawCover = ((_b = $list2.find('img').attr('src')) === null || _b === void 0 ? void 0 : _b.trim()) ||
                                ((_c = $list2.find('img').attr('data-src')) === null || _c === void 0 ? void 0 : _c.trim());
                            var cover = makeAbsolute(rawCover, _this.site) || _this.defaultCover;
                            if (href && name) {
                                var path = getStandardNovelPath(href);
                                if (path)
                                    novels.push({ name: name, path: path, cover: cover });
                            }
                        });
                        // only first entry bcs the others dont have an image
                        $('ul.list').each(function (_i, ul) {
                            var _a;
                            var $firstLi = $(ul).find('li').first();
                            var $a = $firstLi.find('a').first();
                            var href = (_a = $a.attr('href')) === null || _a === void 0 ? void 0 : _a.trim();
                            var name = $a.text().trim() || $firstLi.find('span.author').text().trim();
                            var cover = _this.defaultCover;
                            if (href && name) {
                                var path = getStandardNovelPath(href);
                                if (path)
                                    novels.push({ name: name, path: path, cover: cover });
                            }
                        });
                        return [2 /*return*/, novels];
                }
            });
        });
    };
    // novel details and metadata
    QuanbenPlugin.prototype.parseNovel = function (novelPath) {
        return __awaiter(this, void 0, void 0, function () {
            var standardPath, fullUrl, res, $, _a, $info, $desc, novel;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        standardPath = novelPath.replace(/^\/amp/, '');
                        if (!standardPath.startsWith('/n/') || !standardPath.endsWith('/'))
                            throw new Error("[Quanben parseNovel] Invalid path: ".concat(novelPath));
                        fullUrl = makeAbsolute(standardPath, this.site);
                        if (!fullUrl)
                            throw new Error("[Quanben parseNovel] Could not construct full URL");
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(fullUrl)];
                    case 1:
                        res = _c.sent();
                        if (!res.ok)
                            throw new Error("[Quanben parseNovel] Failed to fetch: ".concat(fullUrl));
                        _a = cheerio_1.load;
                        return [4 /*yield*/, res.text()];
                    case 2:
                        $ = _a.apply(void 0, [_c.sent()]);
                        $info = $('div.list2').first();
                        $desc = $('div.description').first();
                        _b = {
                            path: standardPath,
                            name: $info.find('h3').text().trim() || 'Unknown Novel',
                            cover: makeAbsolute($info.find('img').attr('src'), this.site) ||
                                this.defaultCover,
                            summary: $desc.find('p').text().trim() || $desc.text().trim() || undefined,
                            author: $info.find("p:contains('作者:') span").text().trim() || undefined,
                            status: novelStatus_1.NovelStatus.Unknown,
                            genres: $info.find("p:contains('类别:') span").text().trim() || undefined
                        };
                        return [4 /*yield*/, this.parseChapterList(standardPath)];
                    case 3:
                        novel = (_b.chapters = _c.sent(),
                            _b);
                        novel.status = novelStatus_1.NovelStatus.Completed;
                        return [2 /*return*/, novel];
                }
            });
        });
    };
    QuanbenPlugin.prototype.parseChapterList = function (novelPath) {
        return __awaiter(this, void 0, void 0, function () {
            var url, res, $, _a, chapters, novelName, uniqueChapters;
            var _this = this;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!novelPath.startsWith('/n/') || !novelPath.endsWith('/'))
                            return [2 /*return*/, []];
                        url = makeAbsolute(novelPath + 'list.html', this.site);
                        if (!url)
                            return [2 /*return*/, []];
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url)];
                    case 1:
                        res = _c.sent();
                        if (!res.ok)
                            return [2 /*return*/, []];
                        _a = cheerio_1.load;
                        return [4 /*yield*/, res.text()];
                    case 2:
                        $ = _a.apply(void 0, [_c.sent()]);
                        chapters = [];
                        novelName = (_b = novelPath.match(/\/n\/([^\/]+)\//)) === null || _b === void 0 ? void 0 : _b[1];
                        if (!novelName)
                            return [2 /*return*/, []];
                        $('ul.list3 li a').each(function (_i, el) {
                            var $el = $(el);
                            var name = $el.text().trim();
                            var href = $el.attr('href');
                            if (!name || !href)
                                return;
                            var fileName = getChapterFileName(makeAbsolute(href, _this.site));
                            if (!fileName)
                                return;
                            chapters.push({
                                name: name,
                                path: "".concat(novelName, "/").concat(fileName),
                            });
                        });
                        uniqueChapters = Array.from(new Map(chapters.map(function (c) { return [c.path, c]; })).values());
                        uniqueChapters.sort(function (a, b) {
                            var _a, _b;
                            var numA = parseInt(((_a = a.path.match(/(\d+)\.html$/)) === null || _a === void 0 ? void 0 : _a[1]) || '0', 10);
                            var numB = parseInt(((_b = b.path.match(/(\d+)\.html$/)) === null || _b === void 0 ? void 0 : _b[1]) || '0', 10);
                            return numA - numB;
                        });
                        return [2 /*return*/, uniqueChapters.map(function (c, idx) { return (__assign(__assign({}, c), { chapterNumber: idx + 1 })); })];
                }
            });
        });
    };
    QuanbenPlugin.prototype.parseChapter = function (chapterPath) {
        return __awaiter(this, void 0, void 0, function () {
            var url, res, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!chapterPath.includes('/') || chapterPath.endsWith('/'))
                            throw new Error("[Quanben] Invalid chapter path: \"".concat(chapterPath, "\""));
                        url = "".concat(this.site, "n/").concat(chapterPath);
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url)];
                    case 1:
                        res = _b.sent();
                        if (!res.ok)
                            throw new Error("[Quanben] Failed to fetch chapter: ".concat(url));
                        _a = this.extractChapterContent;
                        return [4 /*yield*/, res.text()];
                    case 2: return [2 /*return*/, _a.apply(this, [_b.sent()])];
                }
            });
        });
    };
    // Helper function to extract and clean chapter content from HTML body
    QuanbenPlugin.prototype.extractChapterContent = function (body) {
        var $ = (0, cheerio_1.load)(body);
        var $content = $('#contentbody, #content, .content').first();
        if (!$content.length)
            return 'Error: Chapter content not found.';
        $content
            .find('script, style, ins, iframe, [class*="ads"], [id*="ads"], [class*="google"], [id*="google"], [class*="recommend"], div[align="center"]')
            .remove();
        return (($content.html() || '').replace(/[\t ]+/g, ' ').trim() ||
            'Error: Chapter content empty.');
    };
    // add search
    QuanbenPlugin.prototype.searchNovels = function (searchTerm) {
        return __awaiter(this, void 0, void 0, function () {
            var url, res, $, _a, novels;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        url = "".concat(this.site, "index.php?c=book&a=search&keywords=").concat(encodeURIComponent(searchTerm));
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url)];
                    case 1:
                        res = _b.sent();
                        if (!res.ok)
                            return [2 /*return*/, []];
                        _a = cheerio_1.load;
                        return [4 /*yield*/, res.text()];
                    case 2:
                        $ = _a.apply(void 0, [_b.sent()]);
                        novels = [];
                        $('div.list2').each(function (_i, el) {
                            var $el = $(el);
                            var $link = $el.find('h3 > a').first();
                            var href = $link.attr('href');
                            var name = $link.text().trim();
                            var cover = makeAbsolute($el.find('img').attr('src') || $el.find('img').attr('data-src'), _this.site);
                            if (href && name) {
                                var path = getStandardNovelPath(makeAbsolute(href, _this.site));
                                if (path)
                                    novels.push({
                                        name: name,
                                        path: '/amp' + path,
                                        cover: cover || _this.defaultCover,
                                    });
                            }
                        });
                        return [2 /*return*/, novels];
                }
            });
        });
    };
    QuanbenPlugin.prototype.fetchImage = function (url) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, (0, fetch_1.fetchApi)(url)];
            });
        });
    };
    return QuanbenPlugin;
}());
exports.default = new QuanbenPlugin();
