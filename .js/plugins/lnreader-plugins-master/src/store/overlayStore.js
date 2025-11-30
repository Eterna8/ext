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
exports.OverlayStore = void 0;
/**
 * @param set Use this inside actions to change the state
 * @param get Use this inside actions to get the current state
 */
var OverlayStore = function (set) { return ({
    // this is initial state
    loading: false,
    // those are actions
    showLoading: function () {
        set(function (state) { return (__assign(__assign({}, state), { loading: true })); });
    },
    hideLoading: function () {
        set(function (state) { return (__assign(__assign({}, state), { loading: false })); });
    },
}); };
exports.OverlayStore = OverlayStore;
