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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var cheerio_1 = require("cheerio");
var fetch_1 = require("@libs/fetch");
var defaultCover_1 = require("@libs/defaultCover");
var novelStatus_1 = require("@libs/novelStatus");
var dayjs_1 = __importDefault(require("dayjs"));
var includesAny = function (str, keywords) {
    return new RegExp(keywords.join('|')).test(str);
};
var BelleRepositoryPlugin = /** @class */ (function () {
    function BelleRepositoryPlugin() {
        var _this = this;
        this.id = 'bellerepository';
        this.name = 'Belle Repository';
        this.icon = 'src/en/bellerepository/mainducky.png';
        this.site = 'https://bellerepository.com/';
        this.version = '1.0.2';
        this.filters = [];
        this.parseData = function (date) {
            var _a;
            var dayJSDate = (0, dayjs_1.default)(); // today
            var timeAgo = ((_a = date.match(/\d+/)) === null || _a === void 0 ? void 0 : _a[0]) || '';
            var timeAgoInt = parseInt(timeAgo, 10);
            if (!timeAgo)
                return date; // there is no number!
            if (includesAny(date, ['detik', 'segundo', 'second', 'วินาที'])) {
                dayJSDate = dayJSDate.subtract(timeAgoInt, 'second'); // go back N seconds
            }
            else if (includesAny(date, [
                'menit',
                'dakika',
                'min',
                'minute',
                'minuto',
                'นาที',
                'دقائق',
            ])) {
                dayJSDate = dayJSDate.subtract(timeAgoInt, 'minute'); // go back N minute
            }
            else if (includesAny(date, [
                'jam',
                'saat',
                'heure',
                'hora',
                'hour',
                'ชั่วโมง',
                'giờ',
                'ore',
                'ساعة',
                '小时',
            ])) {
                dayJSDate = dayJSDate.subtract(timeAgoInt, 'hours'); // go back N hours
            }
            else if (includesAny(date, [
                'hari',
                'gün',
                'jour',
                'día',
                'dia',
                'day',
                'วัน',
                'ngày',
                'giorni',
                'أيام',
                '天',
            ])) {
                dayJSDate = dayJSDate.subtract(timeAgoInt, 'days'); // go back N days
            }
            else if (includesAny(date, ['week', 'semana'])) {
                dayJSDate = dayJSDate.subtract(timeAgoInt, 'week'); // go back N a week
            }
            else if (includesAny(date, ['month', 'mes'])) {
                dayJSDate = dayJSDate.subtract(timeAgoInt, 'month'); // go back N months
            }
            else if (includesAny(date, ['year', 'año'])) {
                dayJSDate = dayJSDate.subtract(timeAgoInt, 'year'); // go back N years
            }
            else {
                if ((0, dayjs_1.default)(date).format('LL') !== 'Invalid Date') {
                    return (0, dayjs_1.default)(date).format('LL');
                }
                return date;
            }
            return dayJSDate.format('LL');
        };
        this.resolveUrl = function (path, isNovel) {
            if (path.startsWith('http')) {
                return path;
            }
            return _this.site + path.replace(/^\//, '');
        };
    }
    BelleRepositoryPlugin.prototype.getCheerio = function (url_1) {
        return __awaiter(this, arguments, void 0, function (url, search) {
            var r, $, _a, title;
            if (search === void 0) { search = false; }
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)(url)];
                    case 1:
                        r = _b.sent();
                        if (!r.ok && !search) {
                            throw new Error('Could not reach site (' + r.status + ') try to open in webview.');
                        }
                        _a = cheerio_1.load;
                        return [4 /*yield*/, r.text()];
                    case 2:
                        $ = _a.apply(void 0, [_b.sent()]);
                        title = $('title').text().trim();
                        if (title == 'Bot Verification' ||
                            title == 'You are being redirected...' ||
                            title == 'Un instant...' ||
                            title == 'Just a moment...' ||
                            title == 'Redirecting...')
                            throw new Error('Captcha error, please open in webview');
                        return [2 /*return*/, $];
                }
            });
        });
    };
    BelleRepositoryPlugin.prototype.parseNovelsFromPage = function (loadedCheerio) {
        var novels = [];
        loadedCheerio('.manga-title-badges').remove();
        loadedCheerio('.page-item-detail, .c-tabs-item__content, .manga-slider .slider__item').each(function (index, element) {
            var novelName = loadedCheerio(element)
                .find('.post-title, .manga-title, h3')
                .first()
                .text()
                .trim();
            var novelUrl = loadedCheerio(element)
                .find('.post-title a, .manga-title a, a')
                .first()
                .attr('href') || '';
            if (!novelName || !novelUrl)
                return;
            var image = loadedCheerio(element).find('img').first();
            var novelCover = image.attr('data-src') ||
                image.attr('src') ||
                image.attr('data-lazy-srcset') ||
                defaultCover_1.defaultCover;
            var novel = {
                name: novelName,
                cover: novelCover,
                path: novelUrl.replace(/https?:\/\/.*?\//, '/'),
            };
            novels.push(novel);
        });
        return novels;
    };
    BelleRepositoryPlugin.prototype.popularNovels = function (pageNo, options) {
        return __awaiter(this, void 0, void 0, function () {
            var url, loadedCheerio, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        url = this.site + '/page/' + pageNo + '/?s=&post_type=wp-manga';
                        if (options === null || options === void 0 ? void 0 : options.showLatestNovels) {
                            url += '&m_orderby=latest';
                        }
                        return [4 /*yield*/, this.getCheerio(url, pageNo != 1)];
                    case 1:
                        loadedCheerio = _a.sent();
                        return [2 /*return*/, this.parseNovelsFromPage(loadedCheerio)];
                    case 2:
                        error_1 = _a.sent();
                        console.error('BelleRepository: Error in popularNovels:', error_1);
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    BelleRepositoryPlugin.prototype.parseNovel = function (novelPath) {
        return __awaiter(this, void 0, void 0, function () {
            var loadedCheerio_1, novel_1, chapters_1, html, _a, novelId, formData, totalChapters_1, error_2;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 8, , 9]);
                        return [4 /*yield*/, this.getCheerio(this.site + novelPath, false)];
                    case 1:
                        loadedCheerio_1 = _b.sent();
                        loadedCheerio_1('.manga-title-badges, #manga-title span').remove();
                        novel_1 = {
                            path: novelPath,
                            name: loadedCheerio_1('.post-title h1').text().trim() ||
                                loadedCheerio_1('#manga-title h1').text().trim() ||
                                loadedCheerio_1('.manga-title').text().trim() ||
                                '',
                        };
                        novel_1.cover =
                            loadedCheerio_1('.summary_image > a > img').attr('data-lazy-src') ||
                                loadedCheerio_1('.summary_image > a > img').attr('data-src') ||
                                loadedCheerio_1('.summary_image > a > img').attr('src') ||
                                defaultCover_1.defaultCover;
                        loadedCheerio_1('.post-content_item, .post-content').each(function () {
                            var detailName = loadedCheerio_1(this).find('h5').text().trim();
                            var detail = loadedCheerio_1(this).find('.summary-content') ||
                                loadedCheerio_1(this).find('.summary_content');
                            switch (detailName) {
                                case 'Genre(s)':
                                case 'Genre':
                                case 'Tags(s)':
                                case 'Tag(s)':
                                case 'Tags':
                                case 'Género(s)':
                                case 'Kategori':
                                case 'التصنيفات':
                                    if (novel_1.genres)
                                        novel_1.genres +=
                                            ', ' +
                                                detail
                                                    .find('a')
                                                    .map(function (i, el) { return loadedCheerio_1(el).text(); })
                                                    .get()
                                                    .join(', ');
                                    else
                                        novel_1.genres = detail
                                            .find('a')
                                            .map(function (i, el) { return loadedCheerio_1(el).text(); })
                                            .get()
                                            .join(', ');
                                    break;
                                case 'Author(s)':
                                case 'Author':
                                case 'Autor(es)':
                                case 'المؤلف':
                                case 'المؤلف (ين)':
                                    novel_1.author = detail.text().trim();
                                    break;
                                case 'Status':
                                case 'Novel':
                                case 'Estado':
                                case 'Durum':
                                    novel_1.status =
                                        detail.text().trim().includes('OnGoing') ||
                                            detail.text().trim().includes('مستمرة')
                                            ? novelStatus_1.NovelStatus.Ongoing
                                            : novelStatus_1.NovelStatus.Completed;
                                    break;
                                case 'Artist(s)':
                                    novel_1.artist = detail.text().trim();
                                    break;
                            }
                        });
                        // Checks for "Madara NovelHub" version
                        {
                            if (!novel_1.genres)
                                novel_1.genres = loadedCheerio_1('.genres-content').text().trim();
                            if (!novel_1.status)
                                novel_1.status = loadedCheerio_1('.manga-status')
                                    .text()
                                    .trim()
                                    .includes('OnGoing')
                                    ? novelStatus_1.NovelStatus.Ongoing
                                    : novelStatus_1.NovelStatus.Completed;
                            if (!novel_1.author)
                                novel_1.author = loadedCheerio_1('.manga-author a').text().trim();
                            if (!novel_1.rating)
                                novel_1.rating = parseFloat(loadedCheerio_1('.post-rating span').text().trim());
                        }
                        if (!novel_1.author)
                            novel_1.author = loadedCheerio_1('.manga-authors').text().trim();
                        loadedCheerio_1('div.summary__content .code-block,script,noscript').remove();
                        novel_1.summary =
                            loadedCheerio_1('div.summary__content').text().trim() ||
                                loadedCheerio_1('#tab-manga-about').text().trim() ||
                                loadedCheerio_1('.post-content_item h5:contains("Summary")')
                                    .next()
                                    .find('span')
                                    .map(function (i, el) { return loadedCheerio_1(el).text(); })
                                    .get()
                                    .join('\n\n')
                                    .trim() ||
                                loadedCheerio_1('.manga-summary p')
                                    .map(function (i, el) { return loadedCheerio_1(el).text(); })
                                    .get()
                                    .join('\n\n')
                                    .trim() ||
                                loadedCheerio_1('.manga-excerpt p')
                                    .map(function (i, el) { return loadedCheerio_1(el).text(); })
                                    .get()
                                    .join('\n\n')
                                    .trim();
                        chapters_1 = [];
                        html = '';
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 4, , 7]);
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(this.site + novelPath + 'ajax/chapters/', {
                                method: 'POST',
                                referrer: this.site + novelPath,
                            }).then(function (res) { return res.text(); })];
                    case 3:
                        html = _b.sent();
                        return [3 /*break*/, 7];
                    case 4:
                        _a = _b.sent();
                        novelId = loadedCheerio_1('.rating-post-id').attr('value') ||
                            loadedCheerio_1('#manga-chapters-holder').attr('data-id') ||
                            '';
                        if (!novelId) return [3 /*break*/, 6];
                        formData = new FormData();
                        formData.append('action', 'manga_get_chapters');
                        formData.append('manga', novelId);
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(this.site + 'wp-admin/admin-ajax.php', {
                                method: 'POST',
                                body: formData,
                            }).then(function (res) { return res.text(); })];
                    case 5:
                        html = _b.sent();
                        _b.label = 6;
                    case 6: return [3 /*break*/, 7];
                    case 7:
                        if (html !== '0' && html) {
                            loadedCheerio_1 = (0, cheerio_1.load)(html);
                        }
                        totalChapters_1 = loadedCheerio_1('.wp-manga-chapter').length;
                        loadedCheerio_1('.wp-manga-chapter').each(function (chapterIndex, element) {
                            var chapterName = loadedCheerio_1(element).find('a').text().trim();
                            var locked = element.attribs['class'].includes('premium-block');
                            if (locked) {
                                chapterName = '🔒 ' + chapterName;
                            }
                            var releaseDate = loadedCheerio_1(element)
                                .find('span.chapter-release-date')
                                .text()
                                .trim();
                            if (releaseDate) {
                                releaseDate = _this.parseData(releaseDate);
                            }
                            else {
                                releaseDate = (0, dayjs_1.default)().format('LL');
                            }
                            var chapterUrl = loadedCheerio_1(element).find('a').attr('href') || '';
                            if (chapterUrl && chapterUrl != '#') {
                                chapters_1.push({
                                    name: chapterName,
                                    path: chapterUrl.replace(/https?:\/\/.*?\//, '/'),
                                    releaseTime: releaseDate || null,
                                    chapterNumber: totalChapters_1 - chapterIndex,
                                });
                            }
                        });
                        novel_1.chapters = chapters_1.reverse();
                        return [2 /*return*/, novel_1];
                    case 8:
                        error_2 = _b.sent();
                        console.error('BelleRepository: Error in parseNovel:', error_2);
                        throw error_2;
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    BelleRepositoryPlugin.prototype.parseChapter = function (chapterPath) {
        return __awaiter(this, void 0, void 0, function () {
            var loadedCheerio, chapterText, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.getCheerio(this.site + chapterPath, false)];
                    case 1:
                        loadedCheerio = _a.sent();
                        chapterText = loadedCheerio('.text-left') ||
                            loadedCheerio('.text-right') ||
                            loadedCheerio('.entry-content') ||
                            loadedCheerio('.c-blog-post > div > div:nth-child(2)');
                        return [2 /*return*/, chapterText.html() || ''];
                    case 2:
                        error_3 = _a.sent();
                        console.error('BelleRepository: Error in parseChapter:', error_3);
                        throw error_3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    BelleRepositoryPlugin.prototype.searchNovels = function (searchTerm, pageNo) {
        return __awaiter(this, void 0, void 0, function () {
            var url, loadedCheerio;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = this.site +
                            '/page/' +
                            (pageNo || 1) +
                            '/?s=' +
                            encodeURIComponent(searchTerm) +
                            '&post_type=wp-manga';
                        return [4 /*yield*/, this.getCheerio(url, true)];
                    case 1:
                        loadedCheerio = _a.sent();
                        return [2 /*return*/, this.parseNovelsFromPage(loadedCheerio)];
                }
            });
        });
    };
    return BelleRepositoryPlugin;
}());
exports.default = new BelleRepositoryPlugin();
