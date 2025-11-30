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
var defaultCover_1 = require("@libs/defaultCover");
var novelStatus_1 = require("@libs/novelStatus");
var makeAbsolute = function (relativeUrl, baseUrl) {
    if (!relativeUrl)
        return undefined;
    try {
        if (relativeUrl.startsWith('//')) {
            return new URL(baseUrl).protocol + relativeUrl;
        }
        if (relativeUrl.startsWith('http://') ||
            relativeUrl.startsWith('https://')) {
            return relativeUrl;
        }
        return new URL(relativeUrl, baseUrl).href;
    }
    catch (_a) {
        return undefined;
    }
};
var ixdzs8Plugin = /** @class */ (function () {
    function ixdzs8Plugin() {
        this.id = 'ixdzs8';
        this.name = '爱下电子书';
        this.site = 'https://ixdzs8.com/';
        this.version = '2.2.8';
        this.icon = 'src/cn/ixdzs8/favicon.png';
        this.imageRequestInit = {
            headers: {
                Referer: this.site,
            },
        };
    }
    ixdzs8Plugin.prototype.popularNovels = function (pageNo) {
        return __awaiter(this, void 0, void 0, function () {
            var url, result, $, _a, novels, processedPaths;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        url = "".concat(this.site, "hot/?page=").concat(pageNo);
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url)];
                    case 1:
                        result = _b.sent();
                        if (!result.ok)
                            return [2 /*return*/, []];
                        _a = cheerio_1.load;
                        return [4 /*yield*/, result.text()];
                    case 2:
                        $ = _a.apply(void 0, [_b.sent()]);
                        novels = [];
                        processedPaths = new Set();
                        $('ul.u-list > li.burl').each(function (_i, el) {
                            var _a, _b;
                            var $el = $(el);
                            var novelPath;
                            var novelName;
                            var novelCover;
                            var $link = $el.find('.l-info h3 a');
                            novelPath = (_a = $link.attr('href')) === null || _a === void 0 ? void 0 : _a.trim();
                            novelName = ($link.attr('title') || $link.text() || '').trim();
                            novelCover = (_b = $el.find('.l-img img').attr('src')) === null || _b === void 0 ? void 0 : _b.trim();
                            if (novelPath && novelName) {
                                novels.push({
                                    name: novelName,
                                    path: novelPath,
                                    cover: makeAbsolute(novelCover, _this.site) || defaultCover_1.defaultCover,
                                });
                                processedPaths.add(novelPath);
                            }
                        });
                        return [2 /*return*/, novels];
                }
            });
        });
    };
    ixdzs8Plugin.prototype.parseNovel = function (novelPath) {
        return __awaiter(this, void 0, void 0, function () {
            var novelUrl, result, $, _a, $novel, $intro, summary, $tagsDiv, statOngoing, statEnd, detail, novel, chapterListPath, _b;
            var _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        novelUrl = makeAbsolute(novelPath, this.site);
                        if (!novelUrl)
                            throw new Error('Invalid novel URL');
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(novelUrl)];
                    case 1:
                        result = _d.sent();
                        if (!result.ok)
                            throw new Error('Failed to fetch novel');
                        _a = cheerio_1.load;
                        return [4 /*yield*/, result.text()];
                    case 2:
                        $ = _a.apply(void 0, [_d.sent()]);
                        $novel = $('div.novel');
                        $intro = $('p#intro.pintro');
                        // Remove any child elements you don't want, e.g., the "read more" icon
                        $intro.find('span.icon').remove();
                        summary = (_c = $intro
                            .html() // get inner HTML
                        ) === null || _c === void 0 ? void 0 : _c.replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]+>/g, '').replace(/\u3000/g, ' ').replace(/&nbsp;/g, ' ').split('\n').map(function (line) { return line.trim(); }).filter(function (line) { return line.length > 0; }).join(' ');
                        $tagsDiv = $('div.panel div.tags');
                        statOngoing = $novel.find('.n-text p span.lz').text().trim();
                        statEnd = $novel.find('.n-text p span.end').text().trim();
                        detail = 'Unknown';
                        if (statEnd.length > 0) {
                            detail = 'Completed';
                        }
                        else if (statOngoing.length > 0) {
                            detail = 'Ongoing';
                        }
                        else {
                            detail = 'Unknown';
                        }
                        novel = {
                            path: novelPath,
                            name: $novel.find('.n-text h1').text().trim() || 'Untitled',
                            cover: makeAbsolute($novel.find('.n-img img').attr('src'), this.site) ||
                                defaultCover_1.defaultCover,
                            summary: summary,
                            author: $novel.find('.n-text p a.bauthor').text().trim() || undefined,
                            genres: $tagsDiv
                                .find('em a')
                                .map(function (_i, el) { return $(el).text().trim(); })
                                .get()
                                .filter(function (tag) { return tag.length > 0; }) // remove empty strings
                                .join(', '),
                            status: detail === 'Ongoing'
                                ? novelStatus_1.NovelStatus.Ongoing
                                : detail === 'Completed'
                                    ? novelStatus_1.NovelStatus.Completed
                                    : novelStatus_1.NovelStatus.Unknown,
                            chapters: [],
                        };
                        chapterListPath = $('#bid').attr('value');
                        if (!chapterListPath) return [3 /*break*/, 4];
                        _b = novel;
                        return [4 /*yield*/, this.parseChapterList(chapterListPath)];
                    case 3:
                        _b.chapters = _d.sent();
                        _d.label = 4;
                    case 4: return [2 /*return*/, novel];
                }
            });
        });
    };
    ixdzs8Plugin.prototype.parseChapterList = function (bid) {
        return __awaiter(this, void 0, void 0, function () {
            var bookId, url, res, json, chapters;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        bookId = String(bid);
                        url = "".concat(this.site, "novel/clist/");
                        return [4 /*yield*/, fetch(url, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/x-www-form-urlencoded',
                                },
                                body: "bid=".concat(bookId),
                            })];
                    case 1:
                        res = _a.sent();
                        if (!res.ok) {
                            throw new Error("Failed to fetch chapters for bid=".concat(bookId));
                        }
                        return [4 /*yield*/, res.json()];
                    case 2:
                        json = _a.sent();
                        if (json.rs !== 200 || !Array.isArray(json.data)) {
                            throw new Error('Invalid response format from chapter list');
                        }
                        chapters = json.data.map(function (ch) {
                            return {
                                name: ch.title,
                                path: ch.ctype === '0' ? "read/".concat(bookId, "/p").concat(ch.ordernum, ".html") : '', // only normal chapters get link
                                releaseTime: undefined, // optional, not provided here
                            };
                        });
                        return [2 /*return*/, chapters];
                }
            });
        });
    };
    ixdzs8Plugin.prototype.parseChapter = function (chapterPath) {
        return __awaiter(this, void 0, void 0, function () {
            var chapterUrl, result, html, tokenMatch, challengeUrl, $, $content, chapterText;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        chapterUrl = makeAbsolute(chapterPath, this.site);
                        if (!chapterUrl)
                            throw new Error('Invalid chapter URL');
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(chapterUrl)];
                    case 1:
                        result = _a.sent();
                        if (!result.ok)
                            throw new Error("Failed to fetch chapter at ".concat(chapterUrl));
                        return [4 /*yield*/, result.text()];
                    case 2:
                        html = _a.sent();
                        if (!(html.includes('正在進行安全驗證') || html.includes('challenge'))) return [3 /*break*/, 5];
                        tokenMatch = html.match(/let token\s*=\s*"([^"]+)"/);
                        if (!tokenMatch) return [3 /*break*/, 5];
                        challengeUrl = chapterUrl + '?challenge=' + encodeURIComponent(tokenMatch[1]);
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(challengeUrl)];
                    case 3:
                        result = _a.sent();
                        if (!result.ok)
                            throw new Error("Failed after challenge redirect: ".concat(challengeUrl));
                        return [4 /*yield*/, result.text()];
                    case 4:
                        html = _a.sent();
                        _a.label = 5;
                    case 5:
                        $ = (0, cheerio_1.load)(html);
                        $content = $('article section');
                        if (!$content.length) {
                            return [2 /*return*/, "Error: Could not find chapter content at ".concat(chapterUrl)];
                        }
                        // Remove ads & junk
                        $content
                            .find('script, style, ins, iframe, [class*="abg"], [class*="ads"], [id*="ads"], [class*="google"], [id*="google"], [class*="recommend"], div[align="center"], p:contains("推薦本書"), a[href*="javascript:"]')
                            .remove();
                        // Drop empty <p>
                        $content.find('p').each(function (_i, el) {
                            var $p = $(el);
                            if (!$p.text().trim())
                                $p.remove();
                        });
                        // Remove HTML comments
                        $content
                            .contents()
                            .filter(function () {
                            return this.type === 'comment';
                        })
                            .remove();
                        // Unwrap <font>
                        $content.find('font').each(function (_i, el) {
                            var $el = $(el);
                            $el.replaceWith($el.html() || '');
                        });
                        chapterText = $content.html();
                        if (!chapterText)
                            return [2 /*return*/, 'Error: Chapter content was empty'];
                        chapterText = chapterText
                            .replace(/<\s*p[^>]*>/gi, '\n\n')
                            .replace(/<\s*br[^>]*>/gi, '\n');
                        chapterText = (0, cheerio_1.load)("<div>".concat(chapterText, "</div>")).text();
                        return [2 /*return*/, chapterText
                                .replace(/[\t ]+/g, ' ')
                                .replace(/\n{3,}/g, '\n\n')
                                .trim()];
                }
            });
        });
    };
    ixdzs8Plugin.prototype.searchNovels = function (searchTerm, pageNo) {
        return __awaiter(this, void 0, void 0, function () {
            var searchUrl, body, result, error_1, $, novels;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        searchUrl = "".concat(this.site, "bsearch?q=").concat(encodeURIComponent(searchTerm));
                        body = '';
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(searchUrl)];
                    case 2:
                        result = _a.sent();
                        if (!result.ok) {
                            throw new Error("Failed to fetch search results: HTTP ".concat(result.status));
                        }
                        return [4 /*yield*/, result.text()];
                    case 3:
                        body = _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        error_1 = _a.sent();
                        if (error_1 instanceof Error) {
                            throw new Error("Failed to fetch search results: ".concat(error_1.message));
                        }
                        throw error_1;
                    case 5:
                        $ = (0, cheerio_1.load)(body);
                        novels = [];
                        $('ul.u-list li.burl').each(function (_i, el) {
                            var _a, _b;
                            var $el = $(el);
                            var novelPath = (_a = $el.attr('data-url')) === null || _a === void 0 ? void 0 : _a.trim();
                            var novelName = $el.find('h3.bname a').text().trim();
                            var novelCover = (_b = $el.find('.l-img img').attr('src')) === null || _b === void 0 ? void 0 : _b.trim();
                            if (novelPath && novelName) {
                                novels.push({
                                    name: novelName,
                                    path: novelPath,
                                    cover: makeAbsolute(novelCover, _this.site) || defaultCover_1.defaultCover,
                                });
                            }
                        });
                        return [2 /*return*/, novels];
                }
            });
        });
    };
    return ixdzs8Plugin;
}());
exports.default = new ixdzs8Plugin();
