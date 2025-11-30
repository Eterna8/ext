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
var NovelUpdates = /** @class */ (function () {
    function NovelUpdates() {
        this.id = 'novelupdates';
        this.name = 'Novel Updates';
        this.version = '0.9.4';
        this.icon = 'src/en/novelupdates/icon.png';
        this.customCSS = 'src/en/novelupdates/customCSS.css';
        this.site = 'https://www.novelupdates.com/';
        this.filters = {
            sort: {
                label: 'Sort Results By',
                value: 'popmonth',
                options: [
                    { label: 'Popular (Month)', value: 'popmonth' },
                    { label: 'Popular (All)', value: 'popular' },
                    { label: 'Last Updated', value: 'sdate' },
                    { label: 'Rating', value: 'srate' },
                    { label: 'Rank', value: 'srank' },
                    { label: 'Reviews', value: 'sreview' },
                    { label: 'Chapters', value: 'srel' },
                    { label: 'Title', value: 'abc' },
                    { label: 'Readers', value: 'sread' },
                    { label: 'Frequency', value: 'sfrel' },
                ],
                type: filterInputs_1.FilterTypes.Picker,
            },
            order: {
                label: 'Order (Not for Popular)',
                value: 'desc',
                options: [
                    { label: 'Descending', value: 'desc' },
                    { label: 'Ascending', value: 'asc' },
                ],
                type: filterInputs_1.FilterTypes.Picker,
            },
            storyStatus: {
                label: 'Story Status (Translation)',
                value: '',
                options: [
                    { label: 'All', value: '' },
                    { label: 'Completed', value: '2' },
                    { label: 'Ongoing', value: '3' },
                    { label: 'Hiatus', value: '4' },
                ],
                type: filterInputs_1.FilterTypes.Picker,
            },
            genre_operator: {
                label: 'Genre (And/Or) (Not for Popular)',
                value: 'and',
                options: [
                    { label: 'And', value: 'and' },
                    { label: 'Or', value: 'or' },
                ],
                type: filterInputs_1.FilterTypes.Picker,
            },
            genres: {
                label: 'Genres',
                type: filterInputs_1.FilterTypes.ExcludableCheckboxGroup,
                value: {
                    include: [],
                    exclude: [],
                },
                options: [
                    { label: 'Action', value: '8' },
                    { label: 'Adult', value: '280' },
                    { label: 'Adventure', value: '13' },
                    { label: 'Comedy', value: '17' },
                    { label: 'Drama', value: '9' },
                    { label: 'Ecchi', value: '292' },
                    { label: 'Fantasy', value: '5' },
                    { label: 'Gender Bender', value: '168' },
                    { label: 'Harem', value: '3' },
                    { label: 'Historical', value: '330' },
                    { label: 'Horror', value: '343' },
                    { label: 'Josei', value: '324' },
                    { label: 'Martial Arts', value: '14' },
                    { label: 'Mature', value: '4' },
                    { label: 'Mecha', value: '10' },
                    { label: 'Mystery', value: '245' },
                    { label: 'Psychoical', value: '486' },
                    { label: 'Romance', value: '15' },
                    { label: 'School Life', value: '6' },
                    { label: 'Sci-fi', value: '11' },
                    { label: 'Seinen', value: '18' },
                    { label: 'Shoujo', value: '157' },
                    { label: 'Shoujo Ai', value: '851' },
                    { label: 'Shounen', value: '12' },
                    { label: 'Shounen Ai', value: '1692' },
                    { label: 'Slice of Life', value: '7' },
                    { label: 'Smut', value: '281' },
                    { label: 'Sports', value: '1357' },
                    { label: 'Supernatural', value: '16' },
                    { label: 'Tragedy', value: '132' },
                    { label: 'Wuxia', value: '479' },
                    { label: 'Xianxia', value: '480' },
                    { label: 'Xuanhuan', value: '3954' },
                    { label: 'Yaoi', value: '560' },
                    { label: 'Yuri', value: '922' },
                ],
            },
            language: {
                label: 'Language',
                value: [],
                options: [
                    { label: 'Chinese', value: '495' },
                    { label: 'Filipino', value: '9181' },
                    { label: 'Indonesian', value: '9179' },
                    { label: 'Japanese', value: '496' },
                    { label: 'Khmer', value: '18657' },
                    { label: 'Korean', value: '497' },
                    { label: 'Malaysian', value: '9183' },
                    { label: 'Thai', value: '9954' },
                    { label: 'Vietnamese', value: '9177' },
                ],
                type: filterInputs_1.FilterTypes.CheckboxGroup,
            },
            novelType: {
                label: 'Novel Type (Not for Popular)',
                value: [],
                options: [
                    { label: 'Light Novel', value: '2443' },
                    { label: 'Published Novel', value: '26874' },
                    { label: 'Web Novel', value: '2444' },
                ],
                type: filterInputs_1.FilterTypes.CheckboxGroup,
            },
            reading_list_operator: {
                label: 'Reading List (Include/Exclude) (Not for Popular)',
                value: 'include',
                options: [
                    { label: 'Include', value: 'include' },
                    { label: 'Exclude', value: 'exclude' },
                ],
                type: filterInputs_1.FilterTypes.Picker,
            },
            reading_lists: {
                label: 'Reading Lists (Not for Popular)',
                value: [],
                options: [{ label: 'All Reading Lists', value: '-1' }],
                type: filterInputs_1.FilterTypes.CheckboxGroup,
            },
        };
    }
    NovelUpdates.prototype.parseNovels = function (loadedCheerio) {
        var _this = this;
        var novels = [];
        loadedCheerio('div.search_main_box_nu').each(function (_, el) {
            var novelUrl = loadedCheerio(el).find('.search_title > a').attr('href');
            if (!novelUrl)
                return;
            novels.push({
                name: loadedCheerio(el).find('.search_title > a').text(),
                cover: loadedCheerio(el).find('img').attr('src'),
                path: novelUrl.replace(_this.site, ''),
            });
        });
        return novels;
    };
    NovelUpdates.prototype.popularNovels = function (page_1, _a) {
        return __awaiter(this, arguments, void 0, function (page, _b) {
            var url, response, body, loadedCheerio;
            var _c, _d, _e, _f;
            var showLatestNovels = _b.showLatestNovels, filters = _b.filters;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        url = this.site;
                        // Build the URL based on filters
                        if (showLatestNovels) {
                            url += 'series-finder/?sf=1&sort=sdate&order=desc';
                        }
                        else if ((filters === null || filters === void 0 ? void 0 : filters.sort.value) === 'popmonth' ||
                            (filters === null || filters === void 0 ? void 0 : filters.sort.value) === 'popular') {
                            url += 'series-ranking/?rank=' + filters.sort.value;
                        }
                        else {
                            url += 'series-finder/?sf=1';
                            if (((_c = filters === null || filters === void 0 ? void 0 : filters.genres.value.include) === null || _c === void 0 ? void 0 : _c.length) ||
                                ((_d = filters === null || filters === void 0 ? void 0 : filters.genres.value.exclude) === null || _d === void 0 ? void 0 : _d.length)) {
                                url += '&mgi=' + filters.genre_operator.value;
                            }
                            if (filters === null || filters === void 0 ? void 0 : filters.novelType.value.length) {
                                url += '&nt=' + filters.novelType.value.join(',');
                            }
                            if (filters === null || filters === void 0 ? void 0 : filters.reading_lists.value.length) {
                                url += '&hd=' + (filters === null || filters === void 0 ? void 0 : filters.reading_lists.value.join(','));
                                url += '&mRLi=' + (filters === null || filters === void 0 ? void 0 : filters.reading_list_operator.value);
                            }
                            url += '&sort=' + (filters === null || filters === void 0 ? void 0 : filters.sort.value);
                            url += '&order=' + (filters === null || filters === void 0 ? void 0 : filters.order.value);
                        }
                        // Add common filters
                        if (filters === null || filters === void 0 ? void 0 : filters.language.value.length)
                            url += '&org=' + filters.language.value.join(',');
                        if ((_e = filters === null || filters === void 0 ? void 0 : filters.genres.value.include) === null || _e === void 0 ? void 0 : _e.length)
                            url += '&gi=' + filters.genres.value.include.join(',');
                        if ((_f = filters === null || filters === void 0 ? void 0 : filters.genres.value.exclude) === null || _f === void 0 ? void 0 : _f.length)
                            url += '&ge=' + filters.genres.value.exclude.join(',');
                        if (filters === null || filters === void 0 ? void 0 : filters.storyStatus.value)
                            url += '&ss=' + filters.storyStatus.value;
                        url += '&pg=' + page;
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url)];
                    case 1:
                        response = _g.sent();
                        return [4 /*yield*/, response.text()];
                    case 2:
                        body = _g.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        return [2 /*return*/, this.parseNovels(loadedCheerio)];
                }
            });
        });
    };
    NovelUpdates.prototype.parseNovel = function (novelPath) {
        return __awaiter(this, void 0, void 0, function () {
            var url, response, body, loadedCheerio, novel, type, summary, rating, novelId, formData, chaptersHtml, chaptersCheerio, chapters;
            var _this = this;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        url = this.site + novelPath;
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url)];
                    case 1:
                        response = _b.sent();
                        return [4 /*yield*/, response.text()];
                    case 2:
                        body = _b.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        novel = {
                            path: novelPath,
                            name: loadedCheerio('.seriestitlenu').text() || 'Untitled',
                            cover: loadedCheerio('.wpb_wrapper img').attr('src'),
                            chapters: [],
                        };
                        novel.author = loadedCheerio('#authtag')
                            .map(function (_, el) { return loadedCheerio(el).text().trim(); })
                            .toArray()
                            .join(', ');
                        novel.genres = loadedCheerio('#seriesgenre')
                            .children('a')
                            .map(function (_, el) { return loadedCheerio(el).text(); })
                            .toArray()
                            .join(',');
                        novel.status = loadedCheerio('#editstatus').text().includes('Ongoing')
                            ? 'Ongoing'
                            : 'Completed';
                        type = loadedCheerio('#showtype').text().trim();
                        summary = loadedCheerio('#editdescription').text().trim();
                        novel.summary = summary + "\n\nType: ".concat(type);
                        rating = (_a = loadedCheerio('.seriesother .uvotes')
                            .text()
                            .match(/(\d+\.\d+) \/ \d+\.\d+/)) === null || _a === void 0 ? void 0 : _a[1];
                        if (rating) {
                            novel.rating = parseFloat(rating);
                        }
                        novelId = loadedCheerio('input#mypostid').attr('value');
                        formData = new FormData();
                        formData.append('action', 'nd_getchapters');
                        formData.append('mygrr', '0');
                        formData.append('mypostid', novelId);
                        return [4 /*yield*/, (0, fetch_1.fetchApi)("".concat(this.site, "wp-admin/admin-ajax.php"), {
                                method: 'POST',
                                body: formData,
                            }).then(function (data) { return data.text(); })];
                    case 3:
                        chaptersHtml = _b.sent();
                        chaptersCheerio = (0, cheerio_1.load)(chaptersHtml);
                        chapters = [];
                        chaptersCheerio('li.sp_li_chp').each(function (_, el) {
                            var chapterName = chaptersCheerio(el)
                                .text()
                                .replace('v', 'volume ')
                                .replace('c', ' chapter ')
                                .replace('part', 'part ')
                                .replace('ss', 'SS')
                                .replace(/\b\w/g, function (l) { return l.toUpperCase(); })
                                .trim();
                            var chapterPath = 'https:' + chaptersCheerio(el).find('a').first().next().attr('href');
                            if (chapterPath)
                                chapters.push({
                                    name: chapterName,
                                    path: chapterPath.replace(_this.site, ''),
                                });
                        });
                        novel.chapters = chapters.reverse();
                        return [2 /*return*/, novel];
                }
            });
        });
    };
    NovelUpdates.prototype.getLocation = function (href) {
        var match = href.match(/^(https?:)\/\/(([^:/?#]*)(?::([0-9]+))?)([/]{0,1}[^?#]*)(\?[^#]*|)(#.*|)$/);
        return match && "".concat(match[1], "//").concat(match[3]);
    };
    NovelUpdates.prototype.getChapterBody = function (loadedCheerio, domain, chapterPath) {
        return __awaiter(this, void 0, void 0, function () {
            var bloatElements, chapterTitle, chapterContent, chapterText, unwanted, targetDomain, _a, apiUrl, response, json, error_1, titleElement, extractBrightNovelsContent, fallbackContent, fallbackCheerio, parts, novelSlug, chapterSlug, url, response, json, data, chapterNumber, title, content, titleElement, error_2, url, json, nodes, data, contentKey, notesKey, footnotesKey, key, mapping, content, notes, footnotes, error_3, chapterString_helscans_1, url, response, body, matchResult, urlPath, pathSegments, pathDepth, loadedCheerioSlicedBread, chapterPath_1, response, body, titleElement, chapterCheerio_1, parts, url, json, titleElement, displayedDiv, loadedCheerioSnow_1, titleElement, chapterId, url, ageVerification, url, response, body, titleElement, url, response, body, scriptContent, jsonString_wetried, chapterId, url, json, titleElement;
            var _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        bloatElements = [];
                        chapterTitle = '';
                        chapterContent = '';
                        chapterText = '';
                        unwanted = ['app', 'blogspot', 'casper', 'wordpress', 'www'];
                        targetDomain = domain.find(function (d) { return !unwanted.includes(d); });
                        _a = targetDomain;
                        switch (_a) {
                            case 'akutranslations': return [3 /*break*/, 1];
                            case 'anotivereads': return [3 /*break*/, 5];
                            case 'arcanetranslations': return [3 /*break*/, 6];
                            case 'asuratls': return [3 /*break*/, 7];
                            case 'brightnovels': return [3 /*break*/, 8];
                            case 'canonstory': return [3 /*break*/, 9];
                            case 'daoist': return [3 /*break*/, 13];
                            case 'fictionread': return [3 /*break*/, 14];
                            case 'genesistudio': return [3 /*break*/, 15];
                            case 'helscans': return [3 /*break*/, 20];
                            case 'hiraethtranslation': return [3 /*break*/, 21];
                            case 'hostednovel': return [3 /*break*/, 22];
                            case 'infinitenoveltranslations': return [3 /*break*/, 23];
                            case 'inoveltranslation': return [3 /*break*/, 27];
                            case 'isotls': return [3 /*break*/, 28];
                            case 'ko-fi': return [3 /*break*/, 29];
                            case 'machineslicedbread': return [3 /*break*/, 30];
                            case 'mirilu': return [3 /*break*/, 34];
                            case 'novelplex': return [3 /*break*/, 35];
                            case 'novelworldtranslations': return [3 /*break*/, 36];
                            case 'raeitranslations': return [3 /*break*/, 37];
                            case 'rainofsnow': return [3 /*break*/, 39];
                            case 'readingpia': return [3 /*break*/, 40];
                            case 'redoxtranslation': return [3 /*break*/, 41];
                            case 'sacredtexttranslations': return [3 /*break*/, 43];
                            case 'scribblehub': return [3 /*break*/, 44];
                            case 'skydemonorder': return [3 /*break*/, 45];
                            case 'stabbingwithasyringe': return [3 /*break*/, 46];
                            case 'tinytranslation': return [3 /*break*/, 50];
                            case 'tumblr': return [3 /*break*/, 51];
                            case 'vampiramtl': return [3 /*break*/, 52];
                            case 'wattpad': return [3 /*break*/, 56];
                            case 'webnovel': return [3 /*break*/, 57];
                            case 'wetriedtls': return [3 /*break*/, 58];
                            case 'wuxiaworld': return [3 /*break*/, 59];
                            case 'yoru': return [3 /*break*/, 60];
                            case 'zetrotranslation': return [3 /*break*/, 63];
                        }
                        return [3 /*break*/, 64];
                    case 1:
                        _d.trys.push([1, 4, , 5]);
                        apiUrl = chapterPath.replace('/novel', '/api/novel');
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(apiUrl)];
                    case 2:
                        response = _d.sent();
                        return [4 /*yield*/, response.json()];
                    case 3:
                        json = _d.sent();
                        if (!(json === null || json === void 0 ? void 0 : json.content)) {
                            throw new Error('Invalid API response structure.');
                        }
                        chapterContent = json.content
                            .trim()
                            .split(/\n+/)
                            .map(function (p) { return p.trim(); })
                            .filter(function (p) { return p.length > 0; })
                            .map(function (p) { return "<p>".concat(p, "</p>"); })
                            .join('\n');
                        return [3 /*break*/, 64];
                    case 4:
                        error_1 = _d.sent();
                        throw new Error("Failed to parse AkuTranslations chapter: ".concat(error_1));
                    case 5:
                        {
                            chapterTitle = loadedCheerio('#comic-nav-name').first().text();
                            chapterContent = loadedCheerio('#spliced-comic').html();
                            return [3 /*break*/, 64];
                        }
                        _d.label = 6;
                    case 6:
                        {
                            bloatElements = ['.bottomnav'];
                            bloatElements.forEach(function (tag) { return loadedCheerio(tag).remove(); });
                            chapterTitle = loadedCheerio('.epwrapper .cat-series').first().text();
                            loadedCheerio('.entry-content div, .entry-content span').each(function (_, element) {
                                var el = loadedCheerio(element);
                                var style = el.attr('style');
                                if (!style)
                                    return; // Skip elements without inline styles
                                if (/border:.*#00219b/.test(style)) {
                                    el.removeAttr('style').addClass('arcane_box_blue'); // Blue box
                                }
                                else if (/border:.*white/.test(style)) {
                                    el.removeAttr('style').addClass('arcane_box_white'); // White box
                                }
                                else if (style.includes('text-transform: uppercase') &&
                                    /text-shadow:.*blue/.test(style)) {
                                    el.removeAttr('style').addClass('arcane_title_blue'); // Blue title
                                }
                                else if (/text-shadow:.*blue/.test(style)) {
                                    el.removeAttr('style').addClass('arcane_text_blue'); // Blue text
                                }
                                else if (/text-shadow:.*lightyellow/.test(style)) {
                                    el.removeAttr('style').addClass('arcane_text_lightyellow'); // Lightyellow text
                                }
                                else if (/color:.*#ff00ff/.test(style)) {
                                    el.removeAttr('style').addClass('arcane_text_pink'); // Pink text
                                }
                            });
                            chapterContent = loadedCheerio('.entry-content').html();
                            return [3 /*break*/, 64];
                        }
                        _d.label = 7;
                    case 7:
                        {
                            titleElement = loadedCheerio('.post-body div b').first();
                            chapterTitle = titleElement.text();
                            titleElement.remove();
                            chapterContent = loadedCheerio('.post-body').html();
                            return [3 /*break*/, 64];
                        }
                        _d.label = 8;
                    case 8:
                        {
                            extractBrightNovelsContent = function (cheerioInstance) {
                                // Remove ad-related bloat elements
                                var bloatElements = ['.ad-container', 'script', 'style'];
                                bloatElements.forEach(function (tag) { return cheerioInstance(tag).remove(); });
                                // Extract the data-page attribute from <div id="app">
                                var dataPage = cheerioInstance('#app').attr('data-page');
                                if (!dataPage) {
                                    throw new Error('data-page attribute not found on Bright Novels.');
                                }
                                // Parse the JSON from data-page
                                var pageData;
                                try {
                                    pageData = JSON.parse(dataPage);
                                }
                                catch (e) {
                                    throw new Error('Failed to parse data-page JSON for Bright Novels.');
                                }
                                var chapterTitle = pageData.props.chapter.title;
                                var chapterContent = pageData.props.chapter.content;
                                // Clean up content (remove inline styles/scripts if needed)
                                var chapterCheerio = (0, cheerio_1.load)(chapterContent);
                                chapterCheerio('script, style').remove();
                                chapterContent = chapterCheerio.html();
                                // Return formatted HTML
                                return "<h2>".concat(chapterTitle, "</h2><hr><br>").concat(chapterContent);
                            };
                            try {
                                chapterText = extractBrightNovelsContent(loadedCheerio);
                            }
                            catch (err) {
                                fallbackContent = loadedCheerio('#app').html() || loadedCheerio('body').html() || '';
                                fallbackCheerio = (0, cheerio_1.load)(fallbackContent);
                                fallbackCheerio('script, style').remove();
                                fallbackContent = fallbackCheerio.html();
                                chapterText = fallbackContent;
                            }
                            return [3 /*break*/, 64];
                        }
                        _d.label = 9;
                    case 9:
                        _d.trys.push([9, 12, , 13]);
                        parts = chapterPath.split('/');
                        if (parts.length < 7) {
                            throw new Error('Invalid chapter URL structure');
                        }
                        novelSlug = parts[4];
                        chapterSlug = parts[6];
                        url = "".concat(parts[0], "//").concat(parts[2], "/api/public/chapter-by-slug/").concat(novelSlug, "/").concat(chapterSlug);
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url)];
                    case 10:
                        response = _d.sent();
                        return [4 /*yield*/, response.json()];
                    case 11:
                        json = _d.sent();
                        if (!((_b = json === null || json === void 0 ? void 0 : json.data) === null || _b === void 0 ? void 0 : _b.currentChapter)) {
                            throw new Error('Invalid API response structure.');
                        }
                        data = json.data.currentChapter;
                        chapterNumber = data.chapterNumber, title = data.title, content = data.content;
                        titleElement = "Chapter ".concat(chapterNumber);
                        chapterTitle = title ? "".concat(titleElement, " - ").concat(title) : titleElement;
                        chapterContent = content.replace(/\n/g, '<br>');
                        return [3 /*break*/, 64];
                    case 12:
                        error_2 = _d.sent();
                        throw new Error("Failed to parse Canon Story chapter: ".concat(error_2));
                    case 13:
                        {
                            chapterTitle = loadedCheerio('.chapter__title').first().text();
                            // Remove locked content indicators
                            loadedCheerio('span.patreon-lock-icon').remove();
                            // Handle lazy-loaded images
                            loadedCheerio('img[data-src]').each(function (_, el) {
                                var $el = loadedCheerio(el);
                                var dataSrc = $el.attr('data-src');
                                if (dataSrc) {
                                    $el.attr('src', dataSrc);
                                    $el.removeAttr('data-src');
                                }
                            });
                            chapterContent = loadedCheerio('.chapter__content').html();
                            return [3 /*break*/, 64];
                        }
                        _d.label = 14;
                    case 14:
                        {
                            bloatElements = [
                                '.content > style',
                                '.highlight-ad-container',
                                '.meaning',
                                '.word',
                            ];
                            bloatElements.forEach(function (tag) { return loadedCheerio(tag).remove(); });
                            chapterTitle = loadedCheerio('.title-image span').first().text();
                            loadedCheerio('.content')
                                .children()
                                .each(function (_, el) {
                                var _a;
                                if ((_a = loadedCheerio(el).attr('id')) === null || _a === void 0 ? void 0 : _a.includes('Chaptertitle-info')) {
                                    loadedCheerio(el).remove();
                                    return false;
                                }
                            });
                            chapterContent = loadedCheerio('.content').html();
                            return [3 /*break*/, 64];
                        }
                        _d.label = 15;
                    case 15:
                        url = "".concat(chapterPath, "/__data.json?x-sveltekit-invalidated=001");
                        _d.label = 16;
                    case 16:
                        _d.trys.push([16, 18, , 19]);
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url).then(function (r) { return r.json(); })];
                    case 17:
                        json = _d.sent();
                        nodes = json.nodes;
                        data = nodes
                            .filter(function (node) { return node.type === 'data'; })
                            .map(function (node) { return node.data; })[0];
                        contentKey = 'content';
                        notesKey = 'notes';
                        footnotesKey = 'footnotes';
                        // Iterate over each property in data to find chapter containers
                        for (key in data) {
                            mapping = data[key];
                            // Check container for keys that match the required fields
                            if (mapping &&
                                typeof mapping === 'object' &&
                                contentKey in mapping &&
                                notesKey in mapping &&
                                footnotesKey in mapping) {
                                content = data[mapping[contentKey]];
                                notes = data[mapping[notesKey]];
                                footnotes = data[mapping[footnotesKey]];
                                // Combine the parts with appropriate formatting
                                chapterText =
                                    content +
                                        (notes ? "<h2>Notes</h2><br>".concat(notes) : '') +
                                        (footnotes !== null && footnotes !== void 0 ? footnotes : '');
                                break;
                            }
                        }
                        return [3 /*break*/, 19];
                    case 18:
                        error_3 = _d.sent();
                        throw new Error("Failed to fetch chapter data: ".concat(error_3));
                    case 19: return [3 /*break*/, 64];
                    case 20:
                        {
                            chapterTitle = loadedCheerio('.entry-title-main').first().text();
                            chapterString_helscans_1 = 'Chapter ' + chapterTitle.split('Chapter')[1].trim();
                            loadedCheerio('#readerarea.rdminimal')
                                .children()
                                .each(function (_, el) {
                                var elementText = loadedCheerio(el).text();
                                if (elementText.includes(chapterString_helscans_1)) {
                                    chapterTitle = elementText;
                                    loadedCheerio(el).remove();
                                    return false;
                                }
                            });
                            chapterContent = loadedCheerio('#readerarea.rdminimal').html();
                            return [3 /*break*/, 64];
                        }
                        _d.label = 21;
                    case 21:
                        {
                            chapterTitle = loadedCheerio('li.active').first().text();
                            chapterContent = loadedCheerio('.text-left').html();
                            return [3 /*break*/, 64];
                        }
                        _d.label = 22;
                    case 22:
                        {
                            chapterTitle = loadedCheerio('#chapter-title').first().text();
                            chapterContent = loadedCheerio('#chapter-content').html();
                            return [3 /*break*/, 64];
                        }
                        _d.label = 23;
                    case 23:
                        url = loadedCheerio('article > p > a').first().attr('href');
                        if (!url) return [3 /*break*/, 26];
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url)];
                    case 24:
                        response = _d.sent();
                        return [4 /*yield*/, response.text()];
                    case 25:
                        body = _d.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        _d.label = 26;
                    case 26:
                        chapterContent = loadedCheerio('.hentry').html();
                        chapterTitle = loadedCheerio('.page-entry-title').text();
                        return [3 /*break*/, 64];
                    case 27:
                        {
                            bloatElements = ['header', 'section'];
                            bloatElements.forEach(function (tag) { return loadedCheerio(tag).remove(); });
                            chapterText = loadedCheerio('.styles_content__JHK8G').html();
                            return [3 /*break*/, 64];
                        }
                        _d.label = 28;
                    case 28:
                        {
                            bloatElements = [
                                'footer',
                                'header',
                                'nav',
                                '.ezoic-ad',
                                '.ezoic-adpicker-ad',
                                '.ezoic-videopicker-video',
                            ];
                            bloatElements.forEach(function (tag) { return loadedCheerio(tag).remove(); });
                            chapterTitle = loadedCheerio('head title').first().text();
                            chapterContent = loadedCheerio('main article').html();
                            return [3 /*break*/, 64];
                        }
                        _d.label = 29;
                    case 29:
                        {
                            matchResult = (_c = loadedCheerio('script:contains("shadowDom.innerHTML")')
                                .html()) === null || _c === void 0 ? void 0 : _c.match(/shadowDom\.innerHTML \+= '(<div.*?)';/);
                            if (matchResult && matchResult[1]) {
                                chapterText = matchResult[1];
                            }
                            return [3 /*break*/, 64];
                        }
                        _d.label = 30;
                    case 30:
                        urlPath = chapterPath.split('/').filter(Boolean);
                        pathSegments = urlPath.slice(2);
                        pathDepth = pathSegments.length;
                        loadedCheerioSlicedBread = loadedCheerio;
                        if (!(pathDepth === 1)) return [3 /*break*/, 33];
                        chapterPath_1 = loadedCheerio('.entry-content a')
                            .first()
                            .attr('href');
                        if (!chapterPath_1) {
                            throw new Error('Chapter path not found.');
                        }
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(chapterPath_1)];
                    case 31:
                        response = _d.sent();
                        if (!response.ok) {
                            throw new Error("Failed to fetch chapter: ".concat(response.status));
                        }
                        return [4 /*yield*/, response.text()];
                    case 32:
                        body = _d.sent();
                        loadedCheerioSlicedBread = (0, cheerio_1.load)(body);
                        _d.label = 33;
                    case 33:
                        // Extract chapter content
                        chapterText = loadedCheerioSlicedBread('.entry-content').html();
                        return [3 /*break*/, 64];
                    case 34:
                        {
                            bloatElements = ['#jp-post-flair'];
                            bloatElements.forEach(function (tag) { return loadedCheerio(tag).remove(); });
                            titleElement = loadedCheerio('.entry-content p strong').first();
                            chapterTitle = titleElement.text();
                            titleElement.remove();
                            chapterContent = loadedCheerio('.entry-content').html();
                            return [3 /*break*/, 64];
                        }
                        _d.label = 35;
                    case 35:
                        {
                            bloatElements = ['.passingthrough_adreminder'];
                            bloatElements.forEach(function (tag) { return loadedCheerio(tag).remove(); });
                            chapterTitle = loadedCheerio('.halChap--jud').first().text();
                            chapterContent = loadedCheerio('.halChap--kontenInner ').html();
                            return [3 /*break*/, 64];
                        }
                        _d.label = 36;
                    case 36:
                        {
                            bloatElements = ['.separator img'];
                            bloatElements.forEach(function (tag) { return loadedCheerio(tag).remove(); });
                            loadedCheerio('.entry-content a')
                                .filter(function (_, el) {
                                var _a;
                                return (((_a = loadedCheerio(el)
                                    .attr('href')) === null || _a === void 0 ? void 0 : _a.includes('https://novelworldtranslations.blogspot.com')) ||
                                    false);
                            })
                                .each(function (_, el) {
                                loadedCheerio(el).parent().remove();
                            });
                            chapterTitle = loadedCheerio('.entry-title').first().text();
                            chapterContent = loadedCheerio('.entry-content')
                                .html()
                                .replace(/&nbsp;/g, '')
                                .replace(/\n/g, '<br>');
                            chapterCheerio_1 = (0, cheerio_1.load)(chapterContent);
                            chapterCheerio_1('span, p, div').each(function (_, el) {
                                if (chapterCheerio_1(el).text().trim() === '') {
                                    chapterCheerio_1(el).remove();
                                }
                            });
                            chapterContent = chapterCheerio_1.html();
                            return [3 /*break*/, 64];
                        }
                        _d.label = 37;
                    case 37:
                        parts = chapterPath.split('/');
                        url = "".concat(parts[0], "//api.").concat(parts[2], "/api/chapters/single?id=").concat(parts[3], "&num=").concat(parts[4]);
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url).then(function (r) { return r.json(); })];
                    case 38:
                        json = _d.sent();
                        titleElement = "Chapter ".concat(json.currentChapter.chapTag);
                        chapterTitle = json.currentChapter.chapTitle
                            ? "".concat(titleElement, " - ").concat(json.currentChapter.chapTitle)
                            : titleElement;
                        chapterContent = [
                            json.novelHead,
                            "<br><hr><br>",
                            json.currentChapter.body,
                            "<br><hr><br>Translator's Note:<br>",
                            json.currentChapter.note,
                        ].join('');
                        chapterContent = chapterContent.replace(/\n/g, '<br>');
                        return [3 /*break*/, 64];
                    case 39:
                        {
                            displayedDiv = loadedCheerio('.bb-item').filter(function () {
                                return loadedCheerio(this).css('display') === 'block';
                            });
                            loadedCheerioSnow_1 = (0, cheerio_1.load)(displayedDiv.html());
                            bloatElements = [
                                '.responsivevoice-button',
                                '.zoomdesc-cont p img',
                                '.zoomdesc-cont p noscript',
                            ];
                            bloatElements.forEach(function (tag) { return loadedCheerioSnow_1(tag).remove(); });
                            chapterContent = loadedCheerioSnow_1('.zoomdesc-cont').html();
                            titleElement = loadedCheerioSnow_1('.scroller h2').first();
                            if (titleElement.length) {
                                chapterTitle = titleElement.text();
                                titleElement.remove();
                                chapterContent = loadedCheerioSnow_1('.zoomdesc-cont').html();
                            }
                            return [3 /*break*/, 64];
                        }
                        _d.label = 40;
                    case 40:
                        {
                            bloatElements = ['.ezoic-ad', '.ezoic-adpicker-ad', '.ez-video-wrap'];
                            bloatElements.forEach(function (tag) { return loadedCheerio(tag).remove(); });
                            chapterText = loadedCheerio('.chapter-body').html();
                            return [3 /*break*/, 64];
                        }
                        _d.label = 41;
                    case 41:
                        chapterId = chapterPath.split('/').pop();
                        chapterTitle = "Chapter ".concat(chapterId);
                        url = "".concat(chapterPath.split('chapter')[0], "txt/").concat(chapterId, ".txt");
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url)
                                .then(function (r) { return r.text(); })
                                .then(function (text) {
                                // Split text into sentences based on newline characters
                                var sentences = text.split('\n');
                                // Process each sentence individually
                                var formattedSentences = sentences.map(function (sentence) {
                                    // Check if the sentence contains "<hr>"
                                    if (sentence.includes('{break}')) {
                                        // Create a centered sentence with three stars
                                        return '<br> <p>****</p>';
                                    }
                                    else {
                                        // Replace text enclosed within ** with <strong> tags
                                        sentence = sentence.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                                        // Replace text enclosed within ++ with <em> tags
                                        sentence = sentence.replace(/\+\+(.*?)\+\+/g, '<em>$1</em>');
                                        return sentence;
                                    }
                                });
                                // Join the formatted sentences back together with newline characters
                                return formattedSentences.join('<br>');
                            })];
                    case 42:
                        chapterContent = _d.sent();
                        return [3 /*break*/, 64];
                    case 43:
                        {
                            bloatElements = [
                                '.entry-content blockquote',
                                '.entry-content div',
                                '.reaction-buttons',
                            ];
                            bloatElements.forEach(function (tag) { return loadedCheerio(tag).remove(); });
                            chapterTitle = loadedCheerio('.entry-title').first().text();
                            chapterContent = loadedCheerio('.entry-content').html();
                            return [3 /*break*/, 64];
                        }
                        _d.label = 44;
                    case 44:
                        {
                            bloatElements = ['.wi_authornotes'];
                            bloatElements.forEach(function (tag) { return loadedCheerio(tag).remove(); });
                            chapterTitle = loadedCheerio('.chapter-title').first().text();
                            chapterContent = loadedCheerio('.chp_raw').html();
                            return [3 /*break*/, 64];
                        }
                        _d.label = 45;
                    case 45:
                        {
                            ageVerification = loadedCheerio('main').text().toLowerCase();
                            if (ageVerification.includes('age verification required')) {
                                throw new Error('Age verification required, please open in webview.');
                            }
                            chapterTitle = "".concat(loadedCheerio('header .font-medium.text-sm').first().text().trim());
                            chapterContent = loadedCheerio('#chapter-body').html();
                            return [3 /*break*/, 64];
                        }
                        _d.label = 46;
                    case 46:
                        url = loadedCheerio('.entry-content a').attr('href');
                        if (!url) return [3 /*break*/, 49];
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url)];
                    case 47:
                        response = _d.sent();
                        return [4 /*yield*/, response.text()];
                    case 48:
                        body = _d.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        _d.label = 49;
                    case 49:
                        bloatElements = [
                            '.has-inline-color',
                            '.wp-block-buttons',
                            '.wpcnt',
                            '#jp-post-flair',
                        ];
                        bloatElements.forEach(function (tag) { return loadedCheerio(tag).remove(); });
                        chapterContent = loadedCheerio('.entry-content').html();
                        titleElement = loadedCheerio('.entry-content h3').first();
                        if (titleElement.length) {
                            chapterTitle = titleElement.text();
                            titleElement.remove();
                            chapterContent = loadedCheerio('.entry-content').html();
                        }
                        return [3 /*break*/, 64];
                    case 50:
                        {
                            bloatElements = [
                                '.content noscript',
                                '.google_translate_element',
                                '.navigate',
                                '.post-views',
                                'br',
                            ];
                            bloatElements.forEach(function (tag) { return loadedCheerio(tag).remove(); });
                            chapterTitle = loadedCheerio('.title-content').first().text();
                            loadedCheerio('.title-content').first().remove();
                            chapterContent = loadedCheerio('.content').html();
                            return [3 /*break*/, 64];
                        }
                        _d.label = 51;
                    case 51:
                        {
                            chapterText = loadedCheerio('.post').html();
                            return [3 /*break*/, 64];
                        }
                        _d.label = 52;
                    case 52:
                        url = loadedCheerio('.entry-content a').attr('href');
                        if (!url) return [3 /*break*/, 55];
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(chapterPath + url)];
                    case 53:
                        response = _d.sent();
                        return [4 /*yield*/, response.text()];
                    case 54:
                        body = _d.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        _d.label = 55;
                    case 55:
                        chapterTitle = loadedCheerio('.entry-title').first().text();
                        chapterContent = loadedCheerio('.entry-content').html();
                        return [3 /*break*/, 64];
                    case 56:
                        {
                            chapterTitle = loadedCheerio('.h2').first().text();
                            chapterContent = loadedCheerio('.part-content pre').html();
                            return [3 /*break*/, 64];
                        }
                        _d.label = 57;
                    case 57:
                        {
                            chapterTitle = loadedCheerio('.cha-tit .pr .dib').first().text();
                            chapterContent = loadedCheerio('.cha-words').html();
                            if (!chapterContent) {
                                chapterContent = loadedCheerio('._content').html();
                            }
                            return [3 /*break*/, 64];
                        }
                        _d.label = 58;
                    case 58:
                        {
                            scriptContent = loadedCheerio('script:contains("p dir=")').html() ||
                                loadedCheerio('script:contains("u003c")').html();
                            if (scriptContent) {
                                jsonString_wetried = scriptContent.slice(scriptContent.indexOf('.push(') + '.push('.length, scriptContent.lastIndexOf(')'));
                                chapterText = JSON.parse(jsonString_wetried)[1];
                            }
                            return [3 /*break*/, 64];
                        }
                        _d.label = 59;
                    case 59:
                        {
                            bloatElements = ['.MuiLink-root'];
                            bloatElements.forEach(function (tag) { return loadedCheerio(tag).remove(); });
                            chapterTitle = loadedCheerio('h4 span').first().text();
                            chapterContent = loadedCheerio('.chapter-content').html();
                            return [3 /*break*/, 64];
                        }
                        _d.label = 60;
                    case 60:
                        chapterId = chapterPath.split('/').pop();
                        url = "https://pxp-main-531j.onrender.com/api/v1/book_chapters/".concat(chapterId, "/content");
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url).then(function (r) { return r.json(); })];
                    case 61:
                        json = _d.sent();
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(json).then(function (r) { return r.text(); })];
                    case 62:
                        chapterText = _d.sent();
                        return [3 /*break*/, 64];
                    case 63:
                        {
                            chapterContent = loadedCheerio('.text-left').html();
                            titleElement = loadedCheerio('.text-left h2').first();
                            if (titleElement.length) {
                                chapterTitle = titleElement.text();
                                titleElement.remove();
                                chapterContent = loadedCheerio('.text-left').html();
                            }
                            else if (chapterContent) {
                                chapterTitle = loadedCheerio('.active').first().text();
                            }
                            return [3 /*break*/, 64];
                        }
                        _d.label = 64;
                    case 64:
                        if (!chapterText) {
                            if (chapterTitle) {
                                chapterText = "<h2>".concat(chapterTitle, "</h2><hr><br>").concat(chapterContent);
                            }
                            else {
                                chapterText = chapterContent;
                            }
                        }
                        return [2 /*return*/, chapterText];
                }
            });
        });
    };
    NovelUpdates.prototype.parseChapter = function (chapterPath) {
        return __awaiter(this, void 0, void 0, function () {
            var chapterText, response, body, url, domainParts, loadedCheerio, blockedTitles, title, isBlogspot, isWordPress, manualWordPress, outliers, bloatElements, titleSelectors, chapterTitle, chapterSubtitle, contentSelectors, chapterContent, chapterCheerio;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)(this.site + chapterPath)];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, response.text()];
                    case 2:
                        body = _a.sent();
                        url = response.url;
                        domainParts = url.toLowerCase().split('/')[2].split('.');
                        loadedCheerio = (0, cheerio_1.load)(body);
                        blockedTitles = [
                            'bot verification',
                            'just a moment...',
                            'redirecting...',
                            'un instant...',
                            'you are being redirected...',
                        ];
                        title = loadedCheerio('title').text().trim().toLowerCase();
                        if (blockedTitles.includes(title)) {
                            throw new Error('Captcha detected, please open in webview.');
                        }
                        // Check if chapter url is wrong or site is down
                        if (!response.ok) {
                            throw new Error("Failed to fetch ".concat(response.url, ": ").concat(response.status, " ").concat(response.statusText));
                        }
                        isBlogspot = ['blogspot', 'blogger'].some(function (keyword) {
                            return [
                                loadedCheerio('meta[name="google-adsense-platform-domain"]').attr('content'),
                                loadedCheerio('meta[name="generator"]').attr('content'),
                            ].some(function (meta) { return meta === null || meta === void 0 ? void 0 : meta.toLowerCase().includes(keyword); });
                        });
                        isWordPress = ['wordpress', 'site kit by google'].some(function (keyword) {
                            return [
                                loadedCheerio('#dcl_comments-js-extra').html(),
                                loadedCheerio('meta[name="generator"]').attr('content'),
                                loadedCheerio('.powered-by').text(),
                                loadedCheerio('footer').text(),
                            ].some(function (meta) { return meta === null || meta === void 0 ? void 0 : meta.toLowerCase().includes(keyword); });
                        });
                        manualWordPress = ['etherreads', 'greenztl2', 'soafp'];
                        if (!isWordPress && domainParts.some(function (wp) { return manualWordPress.includes(wp); })) {
                            isWordPress = true;
                        }
                        outliers = [
                            'anotivereads',
                            'arcanetranslations',
                            'asuratls',
                            'fictionread',
                            'helscans',
                            'hiraethtranslation',
                            'infinitenoveltranslations',
                            'machineslicedbread',
                            'mirilu',
                            'novelworldtranslations',
                            'sacredtexttranslations',
                            'stabbingwithasyringe',
                            'tinytranslation',
                            'vampiramtl',
                            'zetrotranslation',
                        ];
                        if (domainParts.some(function (d) { return outliers.includes(d); })) {
                            isWordPress = false;
                            isBlogspot = false;
                        }
                        if (!(!isWordPress && !isBlogspot)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.getChapterBody(loadedCheerio, domainParts, url)];
                    case 3:
                        chapterText = _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        bloatElements = isBlogspot
                            ? ['.button-container', '.ChapterNav', '.ch-bottom', '.separator']
                            : [
                                '.ad',
                                '.author-avatar',
                                '.chapter-warning',
                                '.entry-meta',
                                '.ezoic-ad',
                                '.mb-center',
                                '.modern-footnotes-footnote__note',
                                '.patreon-widget',
                                '.post-cats',
                                '.pre-bar',
                                '.sharedaddy',
                                '.sidebar',
                                '.swg-button-v2-light',
                                '.wp-block-buttons',
                                //'.wp-block-columns',
                                '.wp-dark-mode-switcher',
                                '.wp-next-post-navi',
                                '#hpk',
                                '#jp-post-flair',
                                '#textbox',
                            ];
                        bloatElements.forEach(function (tag) { return loadedCheerio(tag).remove(); });
                        titleSelectors = isBlogspot
                            ? ['.entry-title', '.post-title', 'head title']
                            : [
                                '.entry-title',
                                '.chapter__title',
                                '.title-content',
                                '.wp-block-post-title',
                                '.title_story',
                                '#chapter-heading',
                                '.chapter-title',
                                'head title',
                                'h1:first-of-type',
                                'h2:first-of-type',
                                '.active',
                            ];
                        chapterTitle = titleSelectors
                            .map(function (sel) { return loadedCheerio(sel).first().text(); })
                            .find(function (text) { return text; });
                        chapterSubtitle = loadedCheerio('.cat-series').first().text() ||
                            loadedCheerio('h1.leading-none ~ span').first().text();
                        if (chapterSubtitle)
                            chapterTitle = chapterSubtitle;
                        contentSelectors = isBlogspot
                            ? ['.content-post', '.entry-content', '.post-body']
                            : [
                                '.chapter__content',
                                '.entry-content',
                                '.text_story',
                                '.post-content',
                                '.contenta',
                                '.single_post',
                                '.main-content',
                                '.reader-content',
                                '#content',
                                '#the-content',
                                'article.post',
                                '.chp_raw',
                            ];
                        chapterContent = contentSelectors
                            .map(function (sel) { return loadedCheerio(sel).html(); })
                            .find(function (html) { return html; });
                        if (chapterTitle && chapterContent) {
                            chapterText = "<h2>".concat(chapterTitle, "</h2><hr><br>").concat(chapterContent);
                        }
                        else {
                            chapterText = chapterContent;
                        }
                        _a.label = 5;
                    case 5:
                        // Fallback content extraction
                        if (!chapterText) {
                            ['nav', 'header', 'footer', '.hidden'].forEach(function (tag) {
                                return loadedCheerio(tag).remove();
                            });
                            chapterText = loadedCheerio('body').html();
                        }
                        // Convert relative URLs to absolute
                        chapterText = chapterText.replace(/href="\//g, "href=\"".concat(this.getLocation(response.url), "/"));
                        chapterCheerio = (0, cheerio_1.load)(chapterText);
                        chapterCheerio('noscript').remove();
                        chapterCheerio('img').each(function (_, el) {
                            var $el = chapterCheerio(el);
                            // Only update if the lazy-loaded attribute exists
                            if ($el.attr('data-lazy-src')) {
                                $el.attr('src', $el.attr('data-lazy-src'));
                            }
                            if ($el.attr('data-lazy-srcset')) {
                                $el.attr('srcset', $el.attr('data-lazy-srcset'));
                            }
                            // Remove lazy-loading class if it exists
                            if ($el.hasClass('lazyloaded')) {
                                $el.removeClass('lazyloaded');
                            }
                        });
                        return [2 /*return*/, chapterCheerio.html()];
                }
            });
        });
    };
    NovelUpdates.prototype.searchNovels = function (searchTerm, page) {
        return __awaiter(this, void 0, void 0, function () {
            var splits, longestSearchTerm, url, response, body, loadedCheerio;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        splits = searchTerm.split('*');
                        longestSearchTerm = splits.reduce(function (a, b) { return (a.length > b.length ? a : b); }, '');
                        searchTerm = longestSearchTerm.replace(/[‘’]/g, "'").replace(/\s+/g, '+');
                        url = "".concat(this.site, "series-finder/?sf=1&sh=").concat(searchTerm, "&sort=srank&order=asc&pg=").concat(page);
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url)];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, response.text()];
                    case 2:
                        body = _a.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        return [2 /*return*/, this.parseNovels(loadedCheerio)];
                }
            });
        });
    };
    return NovelUpdates;
}());
exports.default = new NovelUpdates();
