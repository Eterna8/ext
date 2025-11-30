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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DialogStore = exports.EDialog = void 0;
var EDialog;
(function (EDialog) {
})(EDialog || (exports.EDialog = EDialog = {}));
/**
 * @param set Use this inside actions to change the state
 * @param get Use this inside actions to get the current state
 */
var DialogStore = function (set) { return ({
    // this is initial state
    activeDialogs: [],
    // those are actions
    showDialog: function (dialog) {
        set(function (state) { return (__assign(__assign({}, state), { activeDialogs: __spreadArray(__spreadArray([], state.activeDialogs, true), [dialog], false) })); });
    },
    hideDialog: function (dialog) {
        set(function (state) { return (__assign(__assign({}, state), { activeDialogs: state.activeDialogs.filter(function (d) { return d !== dialog; }) })); });
    },
    hideAllDialogs: function () {
        set(function (state) { return (__assign(__assign({}, state), { activeDialogs: [] })); });
    },
}); };
exports.DialogStore = DialogStore;
