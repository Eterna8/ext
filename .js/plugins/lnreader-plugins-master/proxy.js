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
exports.proxySettingMiddleware = exports.proxyHandlerMiddle = void 0;
var node_process_1 = __importDefault(require("node:process"));
var buffer_1 = require("buffer");
var types_1 = require("./src/types/types");
var http_proxy_1 = __importDefault(require("http-proxy"));
var child_process_1 = require("child_process");
var zlib_1 = require("zlib");
var proxy = http_proxy_1.default.createProxyServer({});
var settings = {
    CLIENT_HOST: 'http://localhost:3000',
    fetchMode: types_1.FetchMode.PROXY,
    disAllowedRequestHeaders: [
        'sec-ch-ua',
        'sec-ch-ua-mobile',
        'sec-ch-ua-platform',
        'sec-fetch-site',
        'origin',
        'sec-fetch-site',
        'sec-fetch-dest',
        'pragma',
    ],
    disAllowResponseHeaders: [
        'link',
        'set-cookie',
        'set-cookie2',
        'content-encoding',
        'content-length',
    ],
    useUserAgent: true,
};
var proxySettingMiddleware = function (req, res) {
    var str = '';
    req.on('data', function (chunk) {
        str += chunk;
    });
    req.on('end', function () {
        try {
            var newSettings = JSON.parse(str);
            for (var key in newSettings) {
                // @ts-ignore
                settings[key] = newSettings[key];
            }
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.write(JSON.stringify(settings));
        }
        catch (_a) {
            res.statusCode = 400;
        }
        finally {
            res.end();
        }
    });
};
exports.proxySettingMiddleware = proxySettingMiddleware;
var proxyHandlerMiddle = function (req, res) {
    var _a;
    var rawUrl = 'https:' + req.url;
    if (req.headers['access-control-request-method']) {
        res.setHeader('access-control-allow-methods', req.headers['access-control-request-method']);
        delete req.headers['access-control-request-method'];
    }
    if (req.headers['access-control-request-headers']) {
        res.setHeader('access-control-allow-headers', req.headers['access-control-request-headers']);
        delete req.headers['access-control-request-headers'];
    }
    res.setHeader('Access-Control-Allow-Origin', settings.CLIENT_HOST);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    if (req.method === 'OPTIONS') {
        res.statusCode = 200;
        res.end();
    }
    else {
        try {
            var _url = new URL(rawUrl);
            for (var _header in req.headers) {
                if (((_a = req.headers[_header]) === null || _a === void 0 ? void 0 : _a.includes('localhost')) ||
                    settings.disAllowedRequestHeaders.includes(_header)) {
                    delete req.headers[_header];
                }
            }
            req.headers['sec-fetch-mode'] = 'cors';
            if (settings.cookies) {
                req.headers['cookie'] = settings.cookies;
            }
            if (!settings.useUserAgent) {
                delete req.headers['user-agent'];
            }
            req.headers.host = _url.host;
            req.url = _url.toString();
            res.statusCode = 200;
            proxyRequest(req, res);
        }
        catch (err) {
            console.log('\x1b[31m', '----------ERRROR----------');
            console.error(err);
            console.log('\x1b[31m', '----------ERRROR----------');
            if (!res.closed) {
                res.end();
            }
        }
    }
};
exports.proxyHandlerMiddle = proxyHandlerMiddle;
var proxyRequest = function (req, res) {
    var _url = new URL(req.url || '');
    console.log('\x1b[36m', '----------------');
    console.log("Making proxy request - at ".concat(new Date().toLocaleTimeString(), "\n  url: ").concat(_url.href, "\n  headers:"));
    Object.entries(req.headers).forEach(function (_a) {
        var name = _a[0], value = _a[1];
        console.log('\t', '\x1b[32m', name + ':', '\x1b[37m', value);
    });
    console.log('\x1b[36m', '----------------');
    if (settings.fetchMode === types_1.FetchMode.CURL) {
        //i mean if it works it works i guess, better than nothing
        var curl = "curl '".concat(_url.href, "'");
        if (settings.useUserAgent) {
            curl += " -H 'User-Agent: ".concat(req.headers['user-agent'], "'");
        }
        if (settings.cookies)
            curl += " -H 'Cookie: ".concat(settings.cookies, "'");
        if (req.headers.origin2)
            curl += " -H 'Origin: ".concat(req.headers.origin2, "'");
        console.log('Running curl command:', curl);
        var isWindows = node_process_1.default.platform === 'win32';
        var options = isWindows
            ? {
                shell: node_process_1.default.env.BASH_LOCATION ||
                    node_process_1.default.env.ProgramFiles + '\\git\\usr\\bin\\bash.exe',
            }
            : {};
        (0, child_process_1.exec)(curl, options, function (error, stdout, stderr) {
            if (error) {
                console.error("exec error: ".concat(error));
                res.statusCode = 500;
                res.write("exec error: ".concat(error));
                res.end();
                return;
            }
            if (stderr) {
                console.error("stderr: ".concat(stderr));
            }
            res.statusCode = 200;
            res.write(stdout);
            res.end();
        });
    }
    else if (settings.fetchMode === types_1.FetchMode.NODE_FETCH) {
        var headers = new Headers();
        if (settings.useUserAgent) {
            headers.append('user-agent', req.headers['user-agent']);
        }
        if (settings.cookies) {
            headers.append('cookie', settings.cookies);
        }
        if (req.headers.origin2) {
            headers.append('origin', req.headers.origin2);
        }
        fetch(_url.href, {
            headers: headers,
        })
            .then(function (res2) { return __awaiter(void 0, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = [res2];
                    return [4 /*yield*/, res2.text()];
                case 1: return [2 /*return*/, _a.concat([_b.sent()])];
            }
        }); }); })
            .then(function (_a) {
            var res2 = _a[0], text = _a[1];
            res.statusCode = res2.status;
            res2.headers.forEach(function (val, key) {
                if (!settings.disAllowResponseHeaders.includes(key)) {
                    res.setHeader(key, val);
                }
            });
            res.write(text);
            res.end();
        })
            .catch(function (err) {
            console.error(err);
            res.statusCode = 500;
            res.end();
        });
    }
    else if (settings.fetchMode === types_1.FetchMode.PROXY) {
        proxy.web(req, res, {
            target: _url.origin,
            selfHandleResponse: true,
            followRedirects: true,
        });
    }
};
proxy.on('proxyRes', function (proxyRes, req, res) {
    var statusCode = proxyRes.statusCode;
    // Redirect
    if (statusCode === 301 ||
        statusCode === 302 ||
        statusCode === 303 ||
        statusCode === 307 ||
        statusCode === 308) {
        req.method = 'GET';
        req.headers['content-length'] = '0';
        delete req.headers['content-type'];
        // Remove all listeners (=reset events to initial state)
        req.removeAllListeners();
        // Initiate a new proxy request.
        proxyRequest(req, res);
        return false;
    }
    var contentEncoding = proxyRes.headers['content-encoding'];
    var isBrotli = contentEncoding &&
        (Array.isArray(contentEncoding)
            ? contentEncoding.some(function (enc) { return enc.includes('br'); })
            : contentEncoding.includes('br'));
    var isGzip = contentEncoding &&
        (Array.isArray(contentEncoding)
            ? contentEncoding.some(function (enc) { return enc.includes('gzip'); })
            : contentEncoding.includes('gzip'));
    var isZstd = contentEncoding &&
        (Array.isArray(contentEncoding)
            ? contentEncoding.some(function (enc) { return enc.includes('zstd'); })
            : contentEncoding.includes('zstd'));
    if (isBrotli || isGzip || isZstd) {
        delete proxyRes.headers['content-encoding'];
        delete proxyRes.headers['content-length'];
        for (var _header in proxyRes.headers) {
            if (!settings.disAllowResponseHeaders.includes(_header)) {
                res.setHeader(_header, proxyRes.headers[_header]);
            }
        }
        var chunks_1 = [];
        proxyRes.on('data', function (chunk) { return chunks_1.push(buffer_1.Buffer.from(chunk)); });
        proxyRes.on('end', function () {
            return __awaiter(this, void 0, void 0, function () {
                var buffer, decompressed;
                return __generator(this, function (_a) {
                    try {
                        buffer = buffer_1.Buffer.concat(chunks_1);
                        decompressed = void 0;
                        if (isBrotli) {
                            decompressed = (0, zlib_1.brotliDecompressSync)(buffer);
                        }
                        else if (isZstd) {
                            decompressed = (0, zlib_1.zstdDecompressSync)(buffer);
                        }
                        else {
                            decompressed = (0, zlib_1.gunzipSync)(buffer);
                        }
                        res.write(buffer_1.Buffer.from(decompressed));
                        res.end();
                    }
                    catch (err) {
                        console.error(err);
                        res.statusCode = 500;
                        res.end("Error decompressing ".concat(isBrotli ? 'Brotli' : 'GZIP', " content"));
                    }
                    return [2 /*return*/];
                });
            });
        });
    }
    else {
        for (var _header in proxyRes.headers) {
            if (!settings.disAllowResponseHeaders.includes(_header)) {
                res.setHeader(_header, proxyRes.headers[_header]);
            }
        }
        for (var _header in settings.disAllowedRequestHeaders) {
            delete proxyRes.headers[_header];
        }
        proxyRes.on('data', function (chunk) {
            res.write(chunk);
        });
        proxyRes.on('end', function () {
            res.end();
        });
    }
});
