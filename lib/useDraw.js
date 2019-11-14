"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var ResizeObserver = window.ResizeObserver;
exports.default = (function (data, box, onReady, onResize) {
    var suit = react_1.useRef(null);
    react_1.useEffect(function () {
        var instance = suit.current = onReady();
        var resizeObserver = new ResizeObserver(function () {
            onResize && onResize();
            instance.resize();
        });
        resizeObserver.observe(box.current);
        return function () {
            instance.destroy();
            resizeObserver.disconnect();
        };
    }, []);
    react_1.useEffect(function () {
        var current = suit.current;
        current && current.init(data);
    }, [data]);
    return {};
});
