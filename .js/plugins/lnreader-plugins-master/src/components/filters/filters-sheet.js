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
Object.defineProperty(exports, "__esModule", { value: true });
exports.FiltersSheet = FiltersSheet;
var react_1 = __importStar(require("react"));
var button_1 = require("@/components/ui/button");
var sheet_1 = require("@/components/ui/sheet");
var filterInputs_1 = require("@libs/filterInputs");
var picker_filter_1 = require("./picker-filter");
var switch_filter_1 = require("./switch-filter");
var text_filter_1 = require("./text-filter");
var checkbox_filter_1 = require("./checkbox-filter");
var excludable_checkbox_filter_1 = require("./excludable-checkbox-filter");
var lucide_react_1 = require("lucide-react");
var renderFilters = function (filters, values, set) {
    var isValueCorrectType = function (o, f) {
        var checkIfIsCorrectObjectType = function (o, f) {
            var areArrays = Array.isArray(o) && Array.isArray(f);
            var areObjects = typeof o === 'object' && typeof f === 'object';
            return areArrays || areObjects;
        };
        return typeof o === typeof f || checkIfIsCorrectObjectType(o, f);
    };
    if (!filters || !values)
        return null;
    return (react_1.default.createElement(react_1.default.Fragment, null, Object.entries(filters).map(function (_a) {
        var key = _a[0], filter = _a[1];
        if (!(key in values)) {
            console.error("No filter value for ".concat(key, " in filter values!"));
            return null;
        }
        switch (filter.type) {
            case filterInputs_1.FilterTypes.Picker: {
                var value = values[key].value;
                if (!isValueCorrectType(value, filter.value)) {
                    console.error("FilterValue for filter [".concat(key, "] has a wrong type!"));
                    return null;
                }
                return (react_1.default.createElement(picker_filter_1.PickerFilter, { key: "picker_filter_".concat(key), filter: { key: key, filter: filter }, value: value, set: function (newValue) { return set(key, newValue); } }));
            }
            case filterInputs_1.FilterTypes.Switch: {
                var value = values[key].value;
                if (!isValueCorrectType(value, filter.value)) {
                    console.error("FilterValue for filter [".concat(key, "] has a wrong type!"));
                    return null;
                }
                return (react_1.default.createElement(switch_filter_1.SwitchFilter, { filter: { key: key, filter: filter }, key: "switch_filter_".concat(key), value: value, set: function (newValue) { return set(key, newValue); } }));
            }
            case filterInputs_1.FilterTypes.TextInput: {
                var value = values[key].value;
                if (!isValueCorrectType(value, filter.value)) {
                    console.error("FilterValue for filter [".concat(key, "] has a wrong type!"));
                    return null;
                }
                return (react_1.default.createElement(text_filter_1.TextFilter, { filter: { key: key, filter: filter }, set: function (newValue) { return set(key, newValue); }, value: value, key: "text_filter_".concat(key) }));
            }
            case filterInputs_1.FilterTypes.CheckboxGroup: {
                var value = values[key].value;
                if (!isValueCorrectType(value, filter.value)) {
                    console.error("FilterValue for filter [".concat(key, "] has a wrong type!"));
                    return null;
                }
                return (react_1.default.createElement(checkbox_filter_1.CheckboxFilter, { filter: { key: key, filter: filter }, set: function (newValue) { return set(key, newValue); }, value: value, key: "checkbox_filter_".concat(key) }));
            }
            case filterInputs_1.FilterTypes.ExcludableCheckboxGroup: {
                var value = values[key].value;
                if (!isValueCorrectType(value, filter.value)) {
                    console.error("FilterValue for filter [".concat(key, "] has a wrong type!"));
                    return null;
                }
                return (react_1.default.createElement(excludable_checkbox_filter_1.ExcludableCheckboxFilter, { filter: { key: key, filter: filter }, set: function (newValue) { return set(key, newValue); }, value: value, key: "xche\u0441kbox_filter_".concat(key) }));
            }
        }
    })));
};
function FiltersSheet(_a) {
    var open = _a.open, onOpenChange = _a.onOpenChange, values = _a.values, setValues = _a.setValues, filters = _a.filters, refetch = _a.refetch;
    var _b = (0, react_1.useState)(null), filterElements = _b[0], setFilterElements = _b[1];
    var setFilterWithKey = function (key, newValue) {
        return setValues(function (fValues) {
            var _a;
            return !fValues
                ? fValues
                : __assign(__assign({}, fValues), (_a = {}, _a[key] = __assign(__assign({}, fValues[key]), { value: newValue }), _a));
        });
    };
    var resetFilters = function () {
        if (filters) {
            var resetValues = {};
            for (var fKey in filters) {
                resetValues[fKey] = {
                    type: filters[fKey].type,
                    value: filters[fKey].value,
                };
            }
            setValues(resetValues);
        }
    };
    (0, react_1.useEffect)(function () {
        setFilterElements(renderFilters(filters, values, setFilterWithKey));
    }, [values, filters]);
    var handleApply = function () {
        refetch();
        onOpenChange(false);
    };
    return (react_1.default.createElement(sheet_1.Sheet, { open: open, onOpenChange: onOpenChange },
        react_1.default.createElement(sheet_1.SheetContent, { side: "right", className: "w-full sm:max-w-md overflow-y-auto" },
            react_1.default.createElement(sheet_1.SheetHeader, null,
                react_1.default.createElement(sheet_1.SheetTitle, null, "Filters"),
                react_1.default.createElement(sheet_1.SheetDescription, null, "Customize your search with these filter options")),
            react_1.default.createElement("div", { className: "py-6 space-y-4" }, filterElements || (react_1.default.createElement("p", { className: "text-sm text-muted-foreground text-center py-8" }, "No filters available"))),
            react_1.default.createElement(sheet_1.SheetFooter, { className: "flex-col sm:flex-col gap-2" },
                react_1.default.createElement(button_1.Button, { onClick: handleApply, className: "w-full" }, "Apply Filters"),
                react_1.default.createElement(button_1.Button, { variant: "outline", onClick: resetFilters, className: "w-full gap-2" },
                    react_1.default.createElement(lucide_react_1.RotateCcw, { className: "w-4 h-4" }),
                    "Reset to Default")))));
}
