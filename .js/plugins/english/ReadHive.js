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
/**
 * ReadHive plugin for LNReader (Custom Laravel Backend)
 *
 * ReadHive uses a custom PHP/Laravel backend with Alpine.js + Tailwind CSS
 * NOT a WordPress/Madara site, so we need custom parsing
 *
 * Supports:
 * - /series/ID/v1/1.1 (chapter format)
 * - /series/ID/1/ (simpler chapter format)
 * - Alpine.js data attributes
 * - Custom Laravel routes
 */
var ReadHivePlugin = /** @class */ (function () {
    function ReadHivePlugin() {
        var _this = this;
        this.id = 'readhive';
        this.name = 'ReadHive';
        this.icon = 'src/en/readhive/readhive.jpg';
        this.site = 'https://readhive.org/';
        this.version = '1.0.3';
        this.filters = [];
        this.resolveUrl = function (path) {
            try {
                return new URL(path, _this.site).toString();
            }
            catch (_a) {
                return _this.site + path;
            }
        };
    }
    ReadHivePlugin.prototype.popularNovels = function (pageNo, options) {
        return __awaiter(this, void 0, void 0, function () {
            var novels, url, response, html, $_1, cards, seen_1, err_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        novels = [];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        url = this.site + '/';
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url)];
                    case 2:
                        response = _a.sent();
                        if (!response.ok)
                            throw new Error("HTTP ".concat(response.status));
                        return [4 /*yield*/, response.text()];
                    case 3:
                        html = _a.sent();
                        $_1 = (0, cheerio_1.load)(html);
                        cards = $_1('.series-card, .series-item, .novel-card, .post, .card').slice(0, 40);
                        cards.each(function (i, el) {
                            var a = $_1(el).find('a[href*="/series/"]').first();
                            if (!a || !a.attr('href'))
                                return;
                            var href = _this.resolveUrl(a.attr('href'));
                            var title = (a.text() ||
                                $_1(el).find('h2, h3, .title').text() ||
                                '').trim();
                            var img = $_1(el).find('img').first();
                            var cover = (img === null || img === void 0 ? void 0 : img.attr('src'))
                                ? _this.resolveUrl(img.attr('src'))
                                : defaultCover_1.defaultCover;
                            novels.push({
                                name: title || href,
                                path: href.replace(_this.site, '/'),
                                cover: cover || defaultCover_1.defaultCover,
                            });
                        });
                        // Fallback: any '/series/' links on homepage
                        if (!novels.length) {
                            seen_1 = new Set();
                            $_1('a[href*="/series/"]').each(function (i, el) {
                                var href = $_1(el).attr('href') || '';
                                var abs = _this.resolveUrl(href);
                                if (seen_1.has(abs))
                                    return;
                                seen_1.add(abs);
                                var title = ($_1(el).text() || '').trim() || abs;
                                novels.push({
                                    name: title,
                                    path: abs.replace(_this.site, '/'),
                                    cover: defaultCover_1.defaultCover,
                                });
                            });
                        }
                        return [3 /*break*/, 5];
                    case 4:
                        err_1 = _a.sent();
                        console.warn('ReadHive popularNovels error', err_1);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/, novels];
                }
            });
        });
    };
    ReadHivePlugin.prototype.searchNovels = function (searchTerm, pageNo) {
        return __awaiter(this, void 0, void 0, function () {
            var novels, url, response, html, $_2, cardSel, cards, seen_2, err_2;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        novels = [];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        url = "".concat(this.site, "/?s=").concat(encodeURIComponent(searchTerm));
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url)];
                    case 2:
                        response = _a.sent();
                        if (!response.ok)
                            throw new Error("HTTP ".concat(response.status));
                        return [4 /*yield*/, response.text()];
                    case 3:
                        html = _a.sent();
                        $_2 = (0, cheerio_1.load)(html);
                        cardSel = '.series-card, .series-item, .novel-card, .post, .card';
                        cards = $_2(cardSel);
                        if (cards.length) {
                            cards.each(function (i, el) {
                                var a = $_2(el).find('a[href*="/series/"]').first();
                                if (!a || !a.attr('href'))
                                    return;
                                var href = _this.resolveUrl(a.attr('href'));
                                var title = (a.text() ||
                                    $_2(el).find('h2, h3, .title').text() ||
                                    '').trim();
                                var img = $_2(el).find('img').first();
                                var cover = (img === null || img === void 0 ? void 0 : img.attr('src'))
                                    ? _this.resolveUrl(img.attr('src'))
                                    : defaultCover_1.defaultCover;
                                novels.push({
                                    name: title || href,
                                    path: href.replace(_this.site, '/'),
                                    cover: cover || defaultCover_1.defaultCover,
                                });
                            });
                        }
                        else {
                            seen_2 = new Set();
                            $_2('a[href*="/series/"]').each(function (i, el) {
                                var href = $_2(el).attr('href') || '';
                                var abs = _this.resolveUrl(href);
                                if (seen_2.has(abs))
                                    return;
                                seen_2.add(abs);
                                var title = ($_2(el).text() || '').trim() || abs;
                                novels.push({
                                    name: title,
                                    path: abs.replace(_this.site, '/'),
                                    cover: defaultCover_1.defaultCover,
                                });
                            });
                        }
                        return [3 /*break*/, 5];
                    case 4:
                        err_2 = _a.sent();
                        console.warn('ReadHive searchNovels error', err_2);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/, novels];
                }
            });
        });
    };
    ReadHivePlugin.prototype.parseNovel = function (novelPath) {
        return __awaiter(this, void 0, void 0, function () {
            // Heuristic sort: extract numeric chapter id from URL or title
            function extractNum(u) {
                // try to match trailing /{number}/ or v{num}/{num} or /v1/1.1
                var m1 = u.match(/\/(\d+(?:\.\d+)?)(?:\/)?$/);
                if (m1)
                    return Number(m1[1]);
                var m2 = u.match(/v\d+\/(\d+(?:\.\d+)?)/);
                if (m2)
                    return Number(m2[1]);
                return null;
            }
            var novel, url_1, response, html, $_3, title, cover, summarySel, summary, _i, _a, sel, txt, statusText, genres, author, chapters_2, chapterContainers, foundChapters, _b, chapterContainers_1, sel, container, seen_3, unique, seenUrls, _c, chapters_1, c, i, err_3;
            var _this = this;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        novel = {
                            path: novelPath,
                            name: 'Untitled',
                            cover: defaultCover_1.defaultCover,
                            chapters: [],
                        };
                        _d.label = 1;
                    case 1:
                        _d.trys.push([1, 4, , 5]);
                        url_1 = this.resolveUrl(novelPath);
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url_1)];
                    case 2:
                        response = _d.sent();
                        if (!response.ok)
                            throw new Error("HTTP ".concat(response.status));
                        return [4 /*yield*/, response.text()];
                    case 3:
                        html = _d.sent();
                        $_3 = (0, cheerio_1.load)(html);
                        title = $_3('h1.series-title, h1, .series-title, .post-title, .entry-title')
                            .first()
                            .text()
                            .trim();
                        if (title)
                            novel.name = title;
                        cover = $_3('img.cover, img.series-cover, .cover img, .post-thumbnail img')
                            .first()
                            .attr('src') || null;
                        if (!cover)
                            cover = $_3('meta[property="og:image"]').attr('content') || null;
                        if (cover)
                            novel.cover = this.resolveUrl(cover);
                        summarySel = '.series-synopsis, .summary, .desc, .description, .entry-summary, .post-excerpt';
                        summary = '';
                        for (_i = 0, _a = summarySel.split(','); _i < _a.length; _i++) {
                            sel = _a[_i];
                            txt = $_3(sel.trim()).first().text().trim();
                            if (txt) {
                                summary = txt;
                                break;
                            }
                        }
                        if (!summary)
                            summary = $_3('meta[name="description"]').attr('content') || '';
                        if (summary)
                            novel.summary = summary;
                        statusText = $_3('.status, .series-status, .novel-status')
                            .first()
                            .text()
                            .trim()
                            .toLowerCase();
                        if (statusText.includes('complete') || statusText.includes('completed'))
                            novel.status = novelStatus_1.NovelStatus.Completed;
                        else if (statusText)
                            novel.status = novelStatus_1.NovelStatus.Ongoing;
                        genres = $_3('.genres, .tags, .series-genres, .post-tags')
                            .first()
                            .text()
                            .trim();
                        if (genres)
                            novel.genres = genres;
                        author = $_3('.author, .series-author, .post-author')
                            .first()
                            .text()
                            .trim();
                        if (author)
                            novel.author = author;
                        chapters_2 = [];
                        chapterContainers = [
                            '#releases',
                            '.releases',
                            '#chapter-list',
                            '.chapter-list',
                            '.chapters',
                            '.series-chapters',
                            '.list-chapters',
                            '.post-content',
                        ];
                        foundChapters = false;
                        for (_b = 0, chapterContainers_1 = chapterContainers; _b < chapterContainers_1.length; _b++) {
                            sel = chapterContainers_1[_b];
                            container = $_3(sel);
                            if (!container || !container.length)
                                continue;
                            container.find('a[href]').each(function (i, el) {
                                var a = $_3(el);
                                var href = a.attr('href') || '';
                                if (!href)
                                    return;
                                var abs = _this.resolveUrl(href);
                                if (!abs.includes('/series/'))
                                    return;
                                var t = (a.text() || a.attr('title') || '').trim() || abs;
                                chapters_2.push({
                                    name: t,
                                    path: abs.replace(_this.site, '/'),
                                    releaseTime: '',
                                    chapterNumber: 0,
                                });
                            });
                            if (chapters_2.length) {
                                foundChapters = true;
                                break;
                            }
                        }
                        // Fallback: scan all links for chapter-like patterns
                        if (!foundChapters) {
                            seen_3 = new Set();
                            $_3('a[href*="/series/"]').each(function (i, el) {
                                var a = $_3(el);
                                var href = a.attr('href') || '';
                                var abs = _this.resolveUrl(href);
                                // match patterns like /series/12345/1/ or /series/12345/v1/1.1
                                if (!abs.match(/\/series\/\d+\/(.+)?/))
                                    return;
                                // try to filter out the overview link itself
                                if (abs.replace(/\/+$/, '') === url_1.replace(/\/+$/, ''))
                                    return;
                                if (seen_3.has(abs))
                                    return;
                                seen_3.add(abs);
                                var t = (a.text() || a.attr('title') || '').trim() || abs;
                                chapters_2.push({
                                    name: t,
                                    path: abs.replace(_this.site, '/'),
                                    releaseTime: '',
                                    chapterNumber: 0,
                                });
                            });
                        }
                        unique = [];
                        seenUrls = new Set();
                        for (_c = 0, chapters_1 = chapters_2; _c < chapters_1.length; _c++) {
                            c = chapters_1[_c];
                            if (seenUrls.has(c.path))
                                continue;
                            seenUrls.add(c.path);
                            unique.push(c);
                        }
                        unique.sort(function (a, b) {
                            var na = extractNum(a.path);
                            var nb = extractNum(b.path);
                            if (na !== null && nb !== null)
                                return na - nb;
                            if (na !== null)
                                return -1;
                            if (nb !== null)
                                return 1;
                            return a.name.localeCompare(b.name);
                        });
                        // Attempt to fill chapterNumber from order (descending to ascending).
                        for (i = 0; i < unique.length; i++) {
                            // assign a reverse index so earlier chapters have lower numbers
                            unique[i].chapterNumber = i + 1;
                        }
                        novel.chapters = unique;
                        return [3 /*break*/, 5];
                    case 4:
                        err_3 = _d.sent();
                        console.error('ReadHive parseNovel error', err_3);
                        novel.chapters = novel.chapters || [];
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/, novel];
                }
            });
        });
    };
    ReadHivePlugin.prototype.parseChapter = function (chapterPath) {
        return __awaiter(this, void 0, void 0, function () {
            var url, response, html, $_4, title, contentSelectors, contentHtml, _i, contentSelectors_1, sel, el, bestHtml_1, bestLen_1, content$_1, cleaned, err_4;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        url = this.resolveUrl(chapterPath);
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url)];
                    case 1:
                        response = _a.sent();
                        if (!response.ok)
                            throw new Error("HTTP ".concat(response.status));
                        return [4 /*yield*/, response.text()];
                    case 2:
                        html = _a.sent();
                        $_4 = (0, cheerio_1.load)(html);
                        title = $_4('h1.chapter-title, .chapter-title, h1, .post-title')
                            .first()
                            .text()
                            .trim();
                        contentSelectors = [
                            '.chapter-content',
                            '.entry-content',
                            '.post-content',
                            '.reader-content',
                            '#chapter-content',
                            '.content',
                            'article',
                        ];
                        contentHtml = '';
                        for (_i = 0, contentSelectors_1 = contentSelectors; _i < contentSelectors_1.length; _i++) {
                            sel = contentSelectors_1[_i];
                            el = $_4(sel).first();
                            if (el && el.text().trim().length > 50) {
                                contentHtml = el.html() || '';
                                break;
                            }
                        }
                        // If not found, pick largest text container
                        if (!contentHtml) {
                            bestHtml_1 = '';
                            bestLen_1 = 0;
                            $_4('div, section, article').each(function (i, el) {
                                var txt = $_4(el).text() || '';
                                if (txt.length > bestLen_1) {
                                    bestLen_1 = txt.length;
                                    bestHtml_1 = $_4(el).html() || '';
                                }
                            });
                            contentHtml = bestHtml_1;
                        }
                        if (!contentHtml)
                            return [2 /*return*/, ''];
                        content$_1 = (0, cheerio_1.load)(contentHtml);
                        // Remove scripts, iframes, share bars, ads, comments
                        content$_1('script, iframe, .share, .shares, .ads, .advert, .toc, .nav, .comments, style, noscript, .related').remove();
                        // Remove empty paragraphs
                        content$_1('p').each(function (i, el) {
                            if ((content$_1(el).text() || '').trim().length === 0)
                                content$_1(el).remove();
                        });
                        // Make image src absolute
                        content$_1('img').each(function (i, el) {
                            var src = content$_1(el).attr('src') || content$_1(el).attr('data-src') || '';
                            if (src)
                                content$_1(el).attr('src', _this.resolveUrl(src));
                        });
                        cleaned = "<h1>".concat(title || '', "</h1>\n").concat(content$_1.html() || '');
                        return [2 /*return*/, cleaned];
                    case 3:
                        err_4 = _a.sent();
                        console.error('ReadHive parseChapter error', err_4);
                        return [2 /*return*/, ''];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return ReadHivePlugin;
}());
exports.default = new ReadHivePlugin();
