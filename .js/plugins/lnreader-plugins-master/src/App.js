"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
var sonner_1 = require("@/components/ui/sonner");
var home_1 = __importDefault(require("./pages/home"));
var tooltip_1 = require("./components/ui/tooltip");
function App() {
    return (react_1.default.createElement("div", { className: "min-h-screen bg-background" },
        react_1.default.createElement(tooltip_1.TooltipProvider, null,
            react_1.default.createElement(sonner_1.Toaster, { position: "bottom-right" }),
            react_1.default.createElement(home_1.default, null))));
}
exports.default = App;
