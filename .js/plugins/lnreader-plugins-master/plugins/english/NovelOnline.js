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
var cheerio_1 = require("cheerio");
var fetch_1 = require("@libs/fetch");
var filterInputs_1 = require("@libs/filterInputs");
var NovelsOnline = /** @class */ (function () {
    function NovelsOnline() {
        this.id = 'NO.net';
        this.name = 'novelsOnline';
        this.site = 'https://novelsonline.org';
        this.icon = 'src/en/novelsonline/icon.png';
        this.version = '1.0.1';
        this.filters = {
            keyword: {
                value: '',
                label: 'Keyword',
                type: filterInputs_1.FilterTypes.TextInput,
            },
            novel_type: {
                value: [],
                label: 'Novel Type',
                options: [
                    { label: 'Web Novel', value: 'Web Novel' },
                    { label: 'Light Novel', value: 'Light Novel' },
                    { label: 'Chinese Novel', value: 'Chinese Novel' },
                    { label: 'Korean Novel', value: 'Korean Novel' },
                ],
                type: filterInputs_1.FilterTypes.CheckboxGroup,
            },
            language: {
                value: [],
                label: 'Language',
                options: [
                    { label: 'Chinese', value: 'Chinese' },
                    { label: 'Japanese', value: 'Japanese' },
                    { label: 'Korean', value: 'Korean' },
                ],
                type: filterInputs_1.FilterTypes.CheckboxGroup,
            },
            genre: {
                value: [],
                label: 'Genre',
                options: [
                    { label: 'Action', value: '4' },
                    { label: 'Adventure', value: '1' },
                    { label: 'Celebrity', value: '39' },
                    { label: 'Comedy', value: '12' },
                    { label: 'Drama', value: '6' },
                    { label: 'Ecchi', value: '47' },
                    { label: 'Fantasy', value: '2' },
                    { label: 'Gender Bender', value: '14' },
                    { label: 'Harem', value: '45' },
                    { label: 'Historical', value: '22' },
                    { label: 'Horror', value: '31' },
                    { label: 'Josei', value: '21' },
                    { label: 'Martial Arts', value: '18' },
                    { label: 'Mature', value: '46' },
                    { label: 'Mecha', value: '30' },
                    { label: 'Mystery', value: '7' },
                    { label: 'Psychological', value: '8' },
                    { label: 'Romance', value: '9' },
                    { label: 'School Life', value: '10' },
                    { label: 'Sci-fi', value: '3' },
                    { label: 'Seinen', value: '23' },
                    { label: 'Shotacon', value: '35' },
                    { label: 'Shoujo', value: '11' },
                    { label: 'Shoujo Ai', value: '34' },
                    { label: 'Shounen', value: '5' },
                    { label: 'Shounen Ai', value: '32' },
                    { label: 'Slice of Life', value: '13' },
                    { label: 'Sports', value: '33' },
                    { label: 'Supernatural', value: '25' },
                    { label: 'Tragedy', value: '24' },
                    { label: 'Wuxia', value: '17' },
                    { label: 'Xianxia', value: '20' },
                    { label: 'Xuanhuan', value: '38' },
                    { label: 'Yaoi', value: '16' },
                    { label: 'Yuri', value: '27' },
                ],
                type: filterInputs_1.FilterTypes.CheckboxGroup,
            },
            completed: {
                value: '',
                label: 'Completed',
                options: [
                    { label: 'Any', value: '' },
                    { label: 'Yes', value: 'yes' },
                    { label: 'No', value: 'no' },
                ],
                type: filterInputs_1.FilterTypes.Picker,
            },
        };
    }
    NovelsOnline.prototype.safeFetch = function (url_1) {
        return __awaiter(this, arguments, void 0, function (url, init) {
            var r, body, $, hasElementNodes;
            if (init === void 0) { init = undefined; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)(url, init)];
                    case 1:
                        r = _a.sent();
                        if (!r.ok)
                            throw new Error('Could not reach site (' + r.status + ') try to open in webview.');
                        return [4 /*yield*/, r.text()];
                    case 2:
                        body = _a.sent();
                        $ = (0, cheerio_1.load)(body);
                        hasElementNodes = $('title') !== undefined;
                        if (!hasElementNodes)
                            throw new Error('Captcha protection detected (Input is random characters). Please try opening the page in WebView.');
                        return [2 /*return*/, $];
                }
            });
        });
    };
    NovelsOnline.prototype.parseNovels = function (loadedCheerio) {
        return __awaiter(this, void 0, void 0, function () {
            var novels;
            var _this = this;
            return __generator(this, function (_a) {
                novels = [];
                loadedCheerio('.top-novel-block').each(function (i, el) {
                    var novelName = loadedCheerio(el).find('h2').text();
                    var novelCover = loadedCheerio(el)
                        .find('.top-novel-cover img')
                        .attr('src');
                    var novelUrl = loadedCheerio(el).find('h2 a').attr('href');
                    if (!novelUrl)
                        return;
                    novels.push({
                        name: novelName,
                        cover: novelCover,
                        path: novelUrl.replace(_this.site, ''),
                    });
                });
                return [2 /*return*/, novels];
            });
        });
    };
    NovelsOnline.prototype.popularNovels = function (page_1, _a) {
        return __awaiter(this, arguments, void 0, function (page, _b) {
            var form, key, _i, _c, value, $;
            var filters = _b.filters;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        form = new URLSearchParams();
                        for (key in filters) {
                            if (key === 'keyword') {
                                form.append('keyword', filters[key].value);
                            }
                            else if (typeof filters[key].value === 'object') {
                                for (_i = 0, _c = filters[key].value; _i < _c.length; _i++) {
                                    value = _c[_i];
                                    form.append("include[".concat(key, "][]"), value);
                                }
                            }
                            else if (filters[key].value) {
                                form.append("include[".concat(key, "][]"), filters[key].value);
                            }
                        }
                        if (form.toString()) {
                            form.append('search', '1');
                            return [2 /*return*/, page == 1 ? this.detailedSearch(form) : []];
                        }
                        return [4 /*yield*/, this.safeFetch(this.site + '/top-novel/' + page)];
                    case 1:
                        $ = _d.sent();
                        return [2 /*return*/, this.parseNovels($)];
                }
            });
        });
    };
    NovelsOnline.prototype.searchNovels = function (searchTerm) {
        return __awaiter(this, void 0, void 0, function () {
            var form;
            return __generator(this, function (_a) {
                form = new URLSearchParams();
                form.append('keyword', searchTerm);
                form.append('search', '1');
                return [2 /*return*/, this.detailedSearch(form)];
            });
        });
    };
    NovelsOnline.prototype.detailedSearch = function (form) {
        return __awaiter(this, void 0, void 0, function () {
            var $;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.safeFetch(this.site + '/detailed-search', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded',
                            },
                            body: form.toString(),
                        })];
                    case 1:
                        $ = _a.sent();
                        return [2 /*return*/, this.parseNovels($)];
                }
            });
        });
    };
    NovelsOnline.prototype.parseNovel = function (novelPath) {
        return __awaiter(this, void 0, void 0, function () {
            var $, novel;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.safeFetch(this.site + novelPath)];
                    case 1:
                        $ = _a.sent();
                        novel = {
                            path: novelPath,
                            name: $('h1').text() || 'Untitled',
                            cover: $('.novel-cover').find('a > img').attr('src'),
                            chapters: [],
                        };
                        $('.novel-detail-item').each(function (i, el) {
                            var detailName = $(el).find('h6').text();
                            var detail = $(el).find('.novel-detail-body');
                            switch (detailName) {
                                case 'Description':
                                    novel.summary = detail.text();
                                    break;
                                case 'Genre':
                                    novel.genres = detail
                                        .find('li')
                                        .map(function (_, el) { return $(el).text(); })
                                        .get()
                                        .join(', ');
                                    break;
                                case 'Author(s)':
                                    novel.author = detail
                                        .find('li')
                                        .map(function (_, el) { return $(el).text(); })
                                        .get()
                                        .join(', ');
                                    break;
                                case 'Artist(s)':
                                    var artist = detail
                                        .find('li')
                                        .map(function (_, el) { return $(el).text(); })
                                        .get()
                                        .join(', ');
                                    if (artist && artist != 'N/A')
                                        novel.artist = artist;
                                    break;
                                case 'Status':
                                    novel.status = detail.text().trim();
                                    break;
                            }
                        });
                        novel.chapters = $('ul.chapter-chs > li > a')
                            .map(function (_, el) {
                            var chapterUrl = $(el).attr('href');
                            var chapterName = $(el).text();
                            return {
                                name: chapterName,
                                path: chapterUrl === null || chapterUrl === void 0 ? void 0 : chapterUrl.replace(_this.site, ''),
                            };
                        })
                            .get();
                        return [2 /*return*/, novel];
                }
            });
        });
    };
    NovelsOnline.prototype.parseChapter = function (chapterPath) {
        return __awaiter(this, void 0, void 0, function () {
            var loadedCheerio, chapterText;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.safeFetch(this.site + chapterPath)];
                    case 1:
                        loadedCheerio = _a.sent();
                        chapterText = loadedCheerio('#contentall').html() || '';
                        return [2 /*return*/, chapterText];
                }
            });
        });
    };
    return NovelsOnline;
}());
exports.default = new NovelsOnline();
