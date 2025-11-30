"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useQueryParams = void 0;
var react_1 = require("react");
var useQueryParams = function () {
    var getParam = (0, react_1.useCallback)(function (key) {
        var urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(key);
    }, []);
    var setParam = (0, react_1.useCallback)(function (key, value) {
        var url = new URL(window.location.href);
        url.searchParams.set(key, value);
        window.history.pushState({}, '', url);
    }, []);
    var removeParam = (0, react_1.useCallback)(function (key) {
        var url = new URL(window.location.href);
        url.searchParams.delete(key);
        window.history.pushState({}, '', url);
    }, []);
    var getAllParams = (0, react_1.useCallback)(function () {
        var urlParams = new URLSearchParams(window.location.search);
        var result = {};
        urlParams.forEach(function (value, key) {
            result[key] = value;
        });
        return result;
    }, []);
    return {
        getParam: getParam,
        setParam: setParam,
        removeParam: removeParam,
        getAllParams: getAllParams,
    };
};
exports.useQueryParams = useQueryParams;
