"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var ScrollEl_1 = __importDefault(require("./ScrollEl"));
function useScroll(box, wrapper) {
    var bar;
    var resolveGrab = function () { };
    var dragInterval = 10;
    react_1.useEffect(function () {
        var boxEl = box.current;
        bar = new ScrollEl_1.default(wrapper.current).setStyles({
            background: '#4169E1',
            width: 10, height: 6, bottom: 0
        });
        var boxGrabCb = function (e) {
            var x1 = getCoordInDocument(e).x;
            var temp = x1;
            boxEl.style.cursor = 'grab';
            document.onmousemove = function (e) {
                requestAnimationFrame(function () {
                    var x2 = getCoordInDocument(e).x;
                    if (Math.abs(x2 - temp) > dragInterval) {
                        resolveGrab(x2 - x1);
                        temp = x2;
                    }
                });
            };
            document.onmouseup = function () {
                document.onmousemove = null;
                boxEl.style.cursor = 'auto';
            };
        };
        boxEl.addEventListener('mousedown', boxGrabCb);
        return function () {
            boxEl.removeEventListener('mousedown', boxGrabCb);
        };
    }, []);
    var g = function () {
        return {
            watch: function (fn) {
                bar.on('change', function (value) {
                    fn(value);
                });
            },
            watchGrab: function (fn, interval) {
                if (interval === void 0) { interval = 10; }
                resolveGrab = fn;
                dragInterval = interval;
            },
            setBarWidth: function (width) {
                bar.setStyles({ width: width });
            },
            setBarLeft: bar.setOffset.bind(bar),
            createRod: function (name, bg) {
                if (bg === void 0) { bg = '#aaa'; }
                var ins = new ScrollEl_1.default(wrapper.current).setStyles({
                    width: 4,
                    background: bg,
                    height: '100%',
                    cursor: 'e-resize'
                }).on('mousedown', function () {
                    document.body.style.cursor = 'e-resize';
                }).on('mouseup', function () {
                    document.body.style.cursor = 'auto';
                });
                ins.el.innerHTML = "\n              <span style=\"user-select:none;position:absolute;bottom:-24px;width:100px;line-height:24px;left:-50px;text-align:center\">\n              " + name + "\n              </span>\n              <div style=\"margin-left:-8px; margin-top:-1px;width: 0; height: 0; border: 10px solid; border-color: " + bg + " transparent transparent transparent\"></div>\n          ";
                return ins;
            }
        };
    };
    return [g];
}
function getCoordInDocument(e) {
    e = e || window.event;
    var x = e.pageX || e.clientX + (document.documentElement.scrollLeft || document.body.scrollLeft);
    var y = e.pageY || e.clientY + (document.documentElement.scrollTop || document.body.scrollTop);
    return { x: x, y: y };
}
exports.default = useScroll;
