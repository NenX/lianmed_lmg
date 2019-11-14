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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
exports.default = (function (props) {
    return (react_1.default.createElement("svg", __assign({}, props, { width: "200", height: "200", xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 100 100", preserveAspectRatio: "xMidYMid" }),
        react_1.default.createElement("circle", { cx: "50", cy: "50", fill: "none", stroke: "#2062b3", "stroke-width": "2", r: "14", "stroke-dasharray": "65.97344572538566 23.991148575128552", transform: "rotate(42.1276 50 50)" },
            react_1.default.createElement("animateTransform", { attributeName: "transform", type: "rotate", calcMode: "linear", values: "0 50 50;360 50 50", keyTimes: "0;1", dur: "1s", begin: "0s", repeatCount: "indefinite" }))));
});
