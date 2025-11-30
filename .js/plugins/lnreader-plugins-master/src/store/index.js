"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAppStore = void 0;
var zustand_1 = require("zustand");
var pluginStore_1 = require("./pluginStore");
var dialogStore_1 = require("./dialogStore");
var overlayStore_1 = require("./overlayStore");
var navigationStore_1 = require("./navigationStore");
exports.useAppStore = (0, zustand_1.create)(function (set, get) { return (__assign(__assign(__assign(__assign(__assign({}, (0, dialogStore_1.DialogStore)(set, get)), (0, overlayStore_1.OverlayStore)(set, get)), (0, pluginStore_1.PluginStore)(set, get)), (0, navigationStore_1.NavigationStore)(set, get)), { useSwitches: !!localStorage.getItem('useSwitches'), setUseSwitches: function (uS) {
        set(function (state) { return (__assign(__assign({}, state), { useSwitches: uS })); });
        if (uS)
            localStorage.setItem('useSwitches', 'true');
        else
            localStorage.removeItem('useSwitches');
    } })); });
