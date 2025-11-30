"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PluginHeader;
var react_1 = __importDefault(require("react"));
function PluginHeader(_a) {
    var selectedPlugin = _a.selectedPlugin;
    return (react_1.default.createElement("header", { className: "border-b" },
        react_1.default.createElement("div", { className: "px-8 py-4 flex items-center justify-between" },
            react_1.default.createElement("div", { className: "flex items-center gap-3" },
                react_1.default.createElement("span", { className: "flex h-9 w-9 shrink-0 items-center justify-center rounded-sm bg-[var(--color-accent-soft)] text-xl font-semibold text-[var(--color-accent-strong)] transition-colors" }, "\u8AAD"),
                react_1.default.createElement("div", null,
                    react_1.default.createElement("h1", { className: "text-sm font-semibold text-foreground" }, "Plugin Playground"),
                    react_1.default.createElement("p", { className: "text-xs text-muted-foreground" }, selectedPlugin === null || selectedPlugin === void 0 ? void 0 : selectedPlugin.name))))));
}
