"use strict";
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
var useScroll_1 = __importDefault(require("./useScroll"));
exports.default = (function (props) {
    var wrapper = react_1.useRef(null);
    var box = props.box, _a = props.getBarTool, getBarTool = _a === void 0 ? function () { } : _a;
    var _getBarTool = useScroll_1.default(box, wrapper)[0];
    react_1.useEffect(function () {
        getBarTool(_getBarTool());
        box.current.style.position = 'relative';
    }, []);
    return (react_1.default.createElement("div", { style: { position: 'absolute', width: '100%', height: '100%', bottom: 0 }, ref: wrapper }));
});
