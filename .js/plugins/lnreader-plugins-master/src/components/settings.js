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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SettingsSection;
var react_1 = __importStar(require("react"));
var lucide_react_1 = require("lucide-react");
var card_1 = require("@/components/ui/card");
var checkbox_1 = require("@/components/ui/checkbox");
var input_1 = require("@/components/ui/input");
var label_1 = require("@/components/ui/label");
var select_1 = require("@/components/ui/select");
var useDebounce_1 = __importDefault(require("@/hooks/useDebounce"));
var types_1 = require("@/types/types");
function SettingsSection() {
    var _a = (0, react_1.useState)(''), cookies = _a[0], setCookies = _a[1];
    var debouncedCookies = (0, useDebounce_1.default)(cookies, 500);
    var _b = (0, react_1.useState)(types_1.FetchMode.PROXY), fetchMode = _b[0], setFetchMode = _b[1];
    var _c = (0, react_1.useState)(true), useUserAgent = _c[0], setUseUserAgent = _c[1];
    var _d = (0, react_1.useState)(false), loading = _d[0], setLoading = _d[1];
    var _e = (0, react_1.useState)(false), alertVisible = _e[0], setAlertVisible = _e[1];
    (0, react_1.useEffect)(function () {
        if (alertVisible) {
            var id_1 = setTimeout(function () { return setAlertVisible(false); }, 2000);
            return function () { return clearTimeout(id_1); };
        }
    }, [alertVisible]);
    (0, react_1.useEffect)(function () {
        setLoading(true);
        fetch('settings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                cookies: debouncedCookies,
                fetchMode: fetchMode,
                useUserAgent: useUserAgent === true,
            }),
        })
            .then(function () { return setAlertVisible(true); })
            .catch(function (error) { return console.error('Failed to save settings:', error); })
            .finally(function () { return setLoading(false); });
    }, [debouncedCookies, fetchMode, useUserAgent]);
    var getFetchModeLabel = function (mode) {
        switch (mode) {
            case types_1.FetchMode.PROXY:
                return 'Proxy';
            case types_1.FetchMode.NODE_FETCH:
                return 'Node Fetch';
            case types_1.FetchMode.CURL:
                return 'Curl';
            default:
                return 'Proxy';
        }
    };
    return (react_1.default.createElement("div", { className: "space-y-6" },
        react_1.default.createElement(card_1.Card, { className: "p-6 relative" },
            alertVisible && (react_1.default.createElement("div", { className: "absolute top-4 right-4 z-10 bg-green-500/90 text-white px-4 py-2 rounded-md flex items-center gap-2 shadow-lg animate-in fade-in slide-in-from-top-2" },
                react_1.default.createElement(lucide_react_1.Check, { className: "w-4 h-4" }),
                "Settings updated")),
            react_1.default.createElement("div", { className: "flex items-center justify-between mb-6" },
                react_1.default.createElement("div", null,
                    react_1.default.createElement("h2", { className: "text-lg font-semibold text-foreground" }, "Settings"),
                    react_1.default.createElement("p", { className: "text-sm text-muted-foreground mt-1" }, "Settings are automatically saved")),
                loading && (react_1.default.createElement("div", { className: "text-sm text-muted-foreground" }, "Saving..."))),
            react_1.default.createElement("div", { className: "space-y-6" },
                react_1.default.createElement("div", null,
                    react_1.default.createElement("div", { className: "flex items-center gap-2 mb-4" },
                        react_1.default.createElement("div", { className: "h-px flex-1 bg-border" }),
                        react_1.default.createElement("h3", { className: "text-sm font-semibold text-muted-foreground uppercase tracking-wide" }, "Request Configuration"),
                        react_1.default.createElement("div", { className: "h-px flex-1 bg-border" })),
                    react_1.default.createElement("div", { className: "space-y-6" },
                        react_1.default.createElement("div", { className: "space-y-2" },
                            react_1.default.createElement(label_1.Label, { className: "font-semibold text-foreground" }, "Browser User Agent"),
                            react_1.default.createElement("div", { className: "flex items-center gap-3" },
                                react_1.default.createElement(input_1.Input, { value: navigator.userAgent, disabled: true, className: "font-mono text-xs flex-1 opacity-60", title: navigator.userAgent }),
                                react_1.default.createElement("div", { className: "flex items-center gap-2 whitespace-nowrap" },
                                    react_1.default.createElement(checkbox_1.Checkbox, { id: "use-ua", checked: useUserAgent, onCheckedChange: setUseUserAgent }),
                                    react_1.default.createElement(label_1.Label, { htmlFor: "use-ua", className: "text-sm text-foreground cursor-pointer" }, "Use"))),
                            react_1.default.createElement("p", { className: "text-xs text-muted-foreground" }, "Enable to send your browser's user agent with requests")),
                        react_1.default.createElement("div", { className: "space-y-2" },
                            react_1.default.createElement(label_1.Label, { htmlFor: "cookies", className: "font-semibold text-foreground" }, "Cookies"),
                            react_1.default.createElement(input_1.Input, { id: "cookies", value: cookies, onChange: function (e) { return setCookies(e.target.value.trim()); }, placeholder: "Enter cookies (optional)...", className: "font-mono text-xs" }),
                            react_1.default.createElement("p", { className: "text-xs text-muted-foreground" }, "Additional cookies to send with requests (optional)")))),
                react_1.default.createElement("div", null,
                    react_1.default.createElement("div", { className: "flex items-center gap-2 mb-4" },
                        react_1.default.createElement("div", { className: "h-px flex-1 bg-border" }),
                        react_1.default.createElement("h3", { className: "text-sm font-semibold text-muted-foreground uppercase tracking-wide" }, "Fetch Settings"),
                        react_1.default.createElement("div", { className: "h-px flex-1 bg-border" })),
                    react_1.default.createElement("div", { className: "space-y-2" },
                        react_1.default.createElement(label_1.Label, { htmlFor: "fetch-mode", className: "font-semibold text-foreground" }, "Fetch Mode"),
                        react_1.default.createElement(select_1.Select, { value: fetchMode.toString(), onValueChange: function (value) {
                                return setFetchMode(parseInt(value));
                            } },
                            react_1.default.createElement(select_1.SelectTrigger, { id: "fetch-mode" },
                                react_1.default.createElement(select_1.SelectValue, null, getFetchModeLabel(fetchMode))),
                            react_1.default.createElement(select_1.SelectContent, null,
                                react_1.default.createElement(select_1.SelectItem, { value: types_1.FetchMode.PROXY.toString() }, "Proxy"),
                                react_1.default.createElement(select_1.SelectItem, { value: types_1.FetchMode.NODE_FETCH.toString() }, "Node Fetch"),
                                react_1.default.createElement(select_1.SelectItem, { value: types_1.FetchMode.CURL.toString() }, "Curl"))),
                        react_1.default.createElement("p", { className: "text-xs text-muted-foreground" }, "Select the method used to fetch data from sources")))))));
}
