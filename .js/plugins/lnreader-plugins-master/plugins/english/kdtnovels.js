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
var KDTNovels = /** @class */ (function () {
    function KDTNovels() {
        this.id = 'kdtnovels';
        this.name = 'KDT Novels';
        this.version = '1.0.0';
        this.icon = 'src/en/kdtnovels/icon.png';
        this.site = 'https://kdtnovels.com/';
    }
    /**
     * Parse novel items from HTML using common selectors
     */
    KDTNovels.prototype.parseNovelItems = function (html) {
        var _this = this;
        var $ = (0, cheerio_1.load)(html);
        var novels = [];
        $('div.c-tabs-item__content').each(function (_, element) {
            var $element = $(element);
            // Extract cover image
            var coverImg = $element.find('div.tab-thumb img').first();
            var cover = coverImg.attr('data-src') || coverImg.attr('src') || defaultCover_1.defaultCover;
            // Extract title and URL
            var titleLink = $element.find('div.post-title > h3 > a').first();
            var name = titleLink.text().trim();
            var href = titleLink.attr('href');
            // Only add if we have required data
            if (name && href) {
                // Convert full URL to relative path, remove leading and trailing slashes
                var path = href.replace(_this.site, '').replace(/^\/+|\/+$/g, '');
                novels.push({
                    name: name,
                    path: path,
                    cover: cover || defaultCover_1.defaultCover,
                });
            }
        });
        return novels;
    };
    /**
     * Parse status text and map it to NovelStatus enum
     */
    KDTNovels.prototype.parseNovelStatus = function (statusText) {
        if (!statusText) {
            return novelStatus_1.NovelStatus.Unknown;
        }
        var normalizedStatus = statusText.toLowerCase().trim();
        // Map common status patterns to NovelStatus enum values
        if (normalizedStatus.includes('ongoing') ||
            normalizedStatus.includes('on going')) {
            return novelStatus_1.NovelStatus.Ongoing;
        }
        if (normalizedStatus.includes('completed') ||
            normalizedStatus.includes('complete')) {
            return novelStatus_1.NovelStatus.Completed;
        }
        if (normalizedStatus.includes('licensed')) {
            return novelStatus_1.NovelStatus.Licensed;
        }
        if (normalizedStatus.includes('finished') ||
            normalizedStatus.includes('publishing finished')) {
            return novelStatus_1.NovelStatus.PublishingFinished;
        }
        if (normalizedStatus.includes('cancelled') ||
            normalizedStatus.includes('canceled')) {
            return novelStatus_1.NovelStatus.Cancelled;
        }
        if (normalizedStatus.includes('hiatus') ||
            normalizedStatus.includes('on hiatus')) {
            return novelStatus_1.NovelStatus.OnHiatus;
        }
        // If no pattern matches, return the original text or Unknown
        return statusText || novelStatus_1.NovelStatus.Unknown;
    };
    KDTNovels.prototype.popularNovels = function (pageNo, options) {
        return __awaiter(this, void 0, void 0, function () {
            var orderBy, url, response, html, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        orderBy = options.showLatestNovels ? 'latest' : 'views';
                        url = "".concat(this.site, "/page/").concat(pageNo, "/?s&post_type=wp-manga&m_orderby=").concat(orderBy);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url)];
                    case 2:
                        response = _a.sent();
                        return [4 /*yield*/, response.text()];
                    case 3:
                        html = _a.sent();
                        // Use common parsing method
                        return [2 /*return*/, this.parseNovelItems(html)];
                    case 4:
                        error_1 = _a.sent();
                        console.error('Error fetching popular novels:', error_1);
                        return [2 /*return*/, []];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    KDTNovels.prototype.searchNovels = function (searchTerm, pageNo) {
        return __awaiter(this, void 0, void 0, function () {
            var url, response, html, novels, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = "".concat(this.site, "/page/").concat(pageNo, "/?s=").concat(encodeURIComponent(searchTerm), "&post_type=wp-manga&op&author&artist&release&adult");
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url)];
                    case 2:
                        response = _a.sent();
                        return [4 /*yield*/, response.text()];
                    case 3:
                        html = _a.sent();
                        novels = this.parseNovelItems(html);
                        // Handle empty search results gracefully
                        if (novels.length === 0) {
                            console.log("No search results found for term: \"".concat(searchTerm, "\" on page ").concat(pageNo));
                        }
                        return [2 /*return*/, novels];
                    case 4:
                        error_2 = _a.sent();
                        console.error('Error searching novels:', error_2);
                        return [2 /*return*/, []];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    KDTNovels.prototype.parseNovel = function (novelPath) {
        return __awaiter(this, void 0, void 0, function () {
            var novelUrl, response, html, $_1, novel, titleElement, coverElement, coverSrc, genreElements, genres_1, summaryElements, summaryParts_1, statusElement, rawStatus, chapters_1, ajaxUrl, chapterResponse, chapterHtml, $chapters_1, chapterElements_1, chapterError_1, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        novelUrl = this.site + novelPath;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 9, , 10]);
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(novelUrl)];
                    case 2:
                        response = _a.sent();
                        return [4 /*yield*/, response.text()];
                    case 3:
                        html = _a.sent();
                        $_1 = (0, cheerio_1.load)(html);
                        novel = {
                            name: '',
                            path: novelPath,
                            cover: defaultCover_1.defaultCover,
                            author: '',
                            artist: '',
                            genres: '',
                            summary: '',
                            status: '',
                            chapters: [],
                        };
                        titleElement = $_1('.manga-title').first();
                        novel.name = titleElement.text().trim() || 'Unknown Title';
                        coverElement = $_1('div.summary_image img').first();
                        coverSrc = coverElement.attr('data-src') || coverElement.attr('src');
                        novel.cover = coverSrc || defaultCover_1.defaultCover;
                        genreElements = $_1('div.genres-content a');
                        genres_1 = [];
                        genreElements.each(function (_, element) {
                            var genre = $_1(element).text().trim();
                            if (genre) {
                                genres_1.push(genre);
                            }
                        });
                        novel.genres = genres_1.join(',');
                        summaryElements = $_1('div.manga-excerpt p');
                        summaryParts_1 = [];
                        summaryElements.each(function (_, element) {
                            var text = $_1(element).text().trim();
                            if (text) {
                                summaryParts_1.push(text);
                            }
                        });
                        novel.summary = summaryParts_1.join('\n\n');
                        statusElement = $_1('div.manga-status span:nth-child(2)').first();
                        rawStatus = statusElement.text().trim();
                        novel.status = this.parseNovelStatus(rawStatus);
                        chapters_1 = [];
                        _a.label = 4;
                    case 4:
                        _a.trys.push([4, 7, , 8]);
                        ajaxUrl = "".concat(novelUrl, "/ajax/chapters/?t=1");
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(ajaxUrl, {
                                method: 'POST',
                            })];
                    case 5:
                        chapterResponse = _a.sent();
                        return [4 /*yield*/, chapterResponse.text()];
                    case 6:
                        chapterHtml = _a.sent();
                        $chapters_1 = (0, cheerio_1.load)(chapterHtml);
                        chapterElements_1 = $chapters_1('li.free-chap');
                        chapterElements_1.each(function (index, element) {
                            var $element = $chapters_1(element);
                            // Extract chapter link and name
                            var chapterLink = $element.find('a').first();
                            var chapterName = chapterLink.text().trim();
                            var chapterHref = chapterLink.attr('href');
                            // Extract release date
                            var releaseDateElement = $element
                                .find('span.chapter-release-date')
                                .first();
                            var releaseTime = releaseDateElement.text().trim() || null;
                            // Extract chapter number from title (opportunistic parsing)
                            var chapterNumber = chapterElements_1.length - index; // Default fallback (reverse order)
                            // Try multiple patterns for chapter number extraction (supporting decimals)
                            var chapterNumberMatch = chapterName.match(/Ch\s*(\d+(?:\.\d+)?)/i);
                            if (!chapterNumberMatch) {
                                chapterNumberMatch = chapterName.match(/c(\d+(?:\.\d+)?)/i);
                            }
                            if (chapterNumberMatch) {
                                chapterNumber = parseFloat(chapterNumberMatch[1]);
                            }
                            if (chapterName && chapterHref) {
                                // Extract just the pathname from the URL, removing leading and trailing slashes
                                var chapterPath = void 0;
                                if (chapterHref.startsWith('http')) {
                                    var url = new URL(chapterHref);
                                    chapterPath = url.pathname.replace(/^\/+|\/+$/g, '');
                                }
                                else {
                                    chapterPath = chapterHref.replace(/^\/+|\/+$/g, '');
                                }
                                chapters_1.push({
                                    name: chapterName,
                                    path: chapterPath,
                                    releaseTime: releaseTime,
                                    chapterNumber: chapterNumber,
                                });
                            }
                        });
                        // Reverse the chapters array since they come in reverse order (latest first)
                        chapters_1.reverse();
                        return [3 /*break*/, 8];
                    case 7:
                        chapterError_1 = _a.sent();
                        console.error('Error fetching chapter list:', chapterError_1);
                        // Fall back to empty chapters array if AJAX request fails
                        chapters_1 = [];
                        return [3 /*break*/, 8];
                    case 8:
                        novel.chapters = chapters_1;
                        return [2 /*return*/, novel];
                    case 9:
                        error_3 = _a.sent();
                        console.error('Error parsing novel:', error_3);
                        // Return basic novel object with minimal data on error
                        return [2 /*return*/, {
                                name: 'Error loading novel',
                                path: novelPath,
                                cover: defaultCover_1.defaultCover,
                                chapters: [],
                            }];
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    KDTNovels.prototype.parseChapter = function (chapterPath) {
        return __awaiter(this, void 0, void 0, function () {
            var chapterUrl, response, html, $_2, contentContainer, chapterContent, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        chapterUrl = this.site + chapterPath;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(chapterUrl)];
                    case 2:
                        response = _a.sent();
                        return [4 /*yield*/, response.text()];
                    case 3:
                        html = _a.sent();
                        $_2 = (0, cheerio_1.load)(html);
                        contentContainer = $_2('div.reading-content').first();
                        if (contentContainer.length === 0) {
                            console.warn('Chapter content container not found');
                            return [2 /*return*/, ''];
                        }
                        // Remove hidden input elements used for tracking (infinite scrolling)
                        contentContainer.find('input[type="hidden"]').remove();
                        // Handle embedded images - ensure they have proper attributes
                        contentContainer.find('img').each(function (_, img) {
                            var $img = $_2(img);
                            // Handle lazy-loaded images by moving data-src to src if needed
                            var dataSrc = $img.attr('data-src');
                            if (dataSrc && !$img.attr('src')) {
                                $img.attr('src', dataSrc);
                            }
                            // Ensure images have alt text for accessibility
                            if (!$img.attr('alt')) {
                                $img.attr('alt', 'Chapter image');
                            }
                        });
                        // Handle special formatting elements - preserve paragraph structure
                        // Ensure proper spacing between paragraphs and other block elements
                        contentContainer.find('p, div, br').each(function (_, element) {
                            var _a, _b;
                            var $element = $_2(element);
                            // Ensure paragraphs have proper spacing
                            if (((_a = element.tagName) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === 'p' && $element.text().trim()) {
                                // Paragraph already has proper HTML structure
                            }
                            // Handle div elements that might contain text
                            if (((_b = element.tagName) === null || _b === void 0 ? void 0 : _b.toLowerCase()) === 'div' &&
                                $element.text().trim()) {
                                // Preserve div structure for special formatting
                            }
                        });
                        chapterContent = contentContainer.html();
                        // Filter out HTML comments
                        if (chapterContent) {
                            chapterContent = chapterContent.replace(/<!--[\s\S]*?-->/g, '');
                        }
                        // Return properly formatted HTML string
                        return [2 /*return*/, (chapterContent === null || chapterContent === void 0 ? void 0 : chapterContent.trim()) || ''];
                    case 4:
                        error_4 = _a.sent();
                        console.error('Error parsing chapter:', error_4);
                        return [2 /*return*/, ''];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    return KDTNovels;
}());
exports.default = new KDTNovels();
