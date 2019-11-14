"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importStar(require("react"));
var antd_1 = require("antd");
var DrawPartogram_1 = require("./DrawPartogram");
exports.default = (function () {
    var box = react_1.useRef(null);
    var canvas1 = react_1.useRef(null);
    var canvas2 = react_1.useRef(null);
    var _a = react_1.useState(false), checked = _a[0], setChecked = _a[1];
    react_1.useEffect(function () {
        var _a = box.current.getBoundingClientRect(), width = _a.width, height = _a.height;
        new DrawPartogram_1.DrawPartogram({
            canvas: canvas1.current,
            canvas2: canvas2.current,
            width: width,
            height: height,
        });
    }, []);
    return (react_1.default.createElement("div", { style: { width: '100%', height: '100%' } },
        react_1.default.createElement("div", { style: { position: 'relative', height: 'calc( 100% - 65px )' }, ref: box },
            react_1.default.createElement("canvas", { ref: canvas1, id: "canvas", width: "1200", height: "480", style: { position: 'absolute' } },
                react_1.default.createElement("p", null, "Your browserdoes not support the canvas element.")),
            react_1.default.createElement("canvas", { ref: canvas2, id: "canvas2", width: "1200", height: "480", style: { position: 'absolute' } },
                react_1.default.createElement("p", null, "Your browserdoes not support the canvas element."))),
        react_1.default.createElement("div", { style: { padding: 20 } },
            react_1.default.createElement("span", null,
                "\u662F\u5426\u663E\u793A\u4E8B\u4EF6\uFF1A",
                react_1.default.createElement(antd_1.Switch, { checked: checked, onChange: function (checked) {
                        setChecked(checked);
                    } })))));
});
