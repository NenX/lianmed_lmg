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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importStar(require("react"));
var Suit_1 = require("./Suit");
var ScrollBar_1 = __importDefault(require("../ScrollBar"));
var Ecg_1 = __importDefault(require("../Ecg"));
var useDraw_1 = __importDefault(require("../useDraw"));
var Loading_1 = __importDefault(require("./Loading"));
exports.default = (function (props) {
    var data = props.data, _a = props.mutableSuitObject, mutableSuitObject = _a === void 0 ? { suit: null } : _a, _b = props.itemHeight, itemHeight = _b === void 0 ? 0 : _b, _c = props.suitType, suitType = _c === void 0 ? 0 : _c, _d = props.showEcg, showEcg = _d === void 0 ? false : _d, _e = props.loading, loading = _e === void 0 ? false : _e, _f = props.onReady, onReady = _f === void 0 ? function (s) { } : _f, others = __rest(props, ["data", "mutableSuitObject", "itemHeight", "suitType", "showEcg", "loading", "onReady"]);
    var barTool;
    var canvasgrid = react_1.useRef(null);
    var canvasdata = react_1.useRef(null);
    var canvasline = react_1.useRef(null);
    var canvasselect = react_1.useRef(null);
    var canvasanalyse = react_1.useRef(null);
    var box = react_1.useRef(null);
    var ctgBox = react_1.useRef(null);
    var suit = react_1.useRef(null);
    var _g = react_1.useState(50), ecgHeight = _g[0], setEcgHeight = _g[1];
    useDraw_1.default(data, box, function () {
        var instance = suit.current = new Suit_1.Suit(canvasgrid.current, canvasdata.current, canvasline.current, canvasselect.current, canvasanalyse.current, ctgBox.current, barTool, suitType);
        onReady(instance);
        mutableSuitObject.suit = instance;
        return instance;
    }, function () {
        var height = box.current.getBoundingClientRect().height;
        var h = height / 5;
        var t = 0;
        h > 50 && (t = h > 200 ? 200 : 50);
        setEcgHeight(t);
    });
    react_1.useLayoutEffect(function () {
        suit.current && suit.current.resize();
    }, [ecgHeight]);
    var canvasStyles = { position: 'absolute' };
    return (react_1.default.createElement("div", __assign({ style: { width: '100%', height: '100%' }, ref: box }, others),
        loading && (react_1.default.createElement("div", { style: { position: 'absolute', width: '100%', height: '100%', background: '#fff', zIndex: 1, opacity: .8 } },
            react_1.default.createElement(Loading_1.default, { style: { margin: 'auto', position: 'absolute', left: 0, right: 0, bottom: 0, top: 0 } }))),
        react_1.default.createElement("div", { style: { height: showEcg ? "calc(100% - " + ecgHeight + "px)" : "100%", position: 'relative' }, ref: ctgBox },
            react_1.default.createElement("canvas", { style: canvasStyles, ref: canvasgrid }),
            react_1.default.createElement("canvas", { style: canvasStyles, ref: canvasline }),
            react_1.default.createElement("canvas", { style: canvasStyles, ref: canvasdata }),
            react_1.default.createElement("canvas", { style: canvasStyles, ref: canvasselect }),
            react_1.default.createElement("canvas", { style: canvasStyles, ref: canvasanalyse })),
        showEcg && (react_1.default.createElement("div", { style: { height: ecgHeight, overflow: 'hidden' } },
            react_1.default.createElement(Ecg_1.default, { data: data }))),
        react_1.default.createElement(ScrollBar_1.default, { box: box, getBarTool: function (tool) { barTool = tool; } })));
});
