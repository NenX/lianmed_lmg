"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("@lianmed/utils");
var ScrollEl = (function (_super) {
    __extends(ScrollEl, _super);
    function ScrollEl(wrapper) {
        var _this = _super.call(this) || this;
        _this.moveCb = function (e) {
            _this.emit('mousedown');
            e.stopPropagation();
            var _a = _this, el = _a.el, wrapper = _a.wrapper;
            var x = _this.getCoordInDocument(e).x;
            var elRex = el.getBoundingClientRect();
            var boxRec = wrapper.getBoundingClientRect();
            var elLeft = elRex.left;
            var boxLeft = boxRec.left;
            var span = x - elLeft;
            document.onmousemove = function (e) {
                requestAnimationFrame(function () {
                    var x = _this.getCoordInDocument(e).x;
                    var offsetLeft = x - (boxLeft + span);
                    _this.setOffset(offsetLeft);
                });
            };
            document.onmouseup = function () {
                _this.emit('mouseup');
                document.onmousemove = null;
            };
        };
        var el = _this.el = document.createElement('div');
        _this.wrapper = wrapper;
        el.addEventListener('mousedown', _this.moveCb);
        wrapper.append(el);
        el.setAttribute('style', "background:red;position:absolute;user-select:none");
        return _this;
    }
    ScrollEl.prototype.setStyle = function (key, value) {
        var keys = ['width', 'height', 'left', 'right', 'top', 'bottom', 'margin'];
        this.el.style[key] = String(value) + ((keys.includes(key) && typeof value === 'number') ? 'px' : '');
        return this;
    };
    ScrollEl.prototype.setStyles = function (styles) {
        var _this = this;
        Object.keys(styles).forEach(function (key) {
            _this.setStyle(key, styles[key]);
        });
        return this;
    };
    ScrollEl.prototype.toggleVisibility = function () {
        var isHidden = this.el.style.visibility === 'hidden';
        this.setStyle('visibility', isHidden ? 'visible' : 'hidden');
    };
    ScrollEl.prototype.setVisibility = function (isHidden) {
        this.setStyle('visibility', isHidden ? 'visible' : 'hidden');
    };
    ScrollEl.prototype.addEventListener = function (key, cb) {
        this.el.addEventListener(key, cb);
        return this;
    };
    ScrollEl.prototype.setOffset = function (offset, isfire) {
        if (isfire === void 0) { isfire = true; }
        var _a = this, el = _a.el, wrapper = _a.wrapper;
        var boxRec = wrapper.getBoundingClientRect();
        var barRex = el.getBoundingClientRect();
        var boxWidth = boxRec.width;
        var barWidth = barRex.width;
        var distance = boxWidth - barWidth;
        var result = offset <= 0 ? 0 : offset >= distance ? distance : offset;
        if (el.style['left'] != (result + 'px')) {
            this.setStyle('left', result);
            if (isfire)
                this.emit('change', result);
        }
    };
    ScrollEl.prototype.getCoordInDocument = function (e) {
        e = e || window.event;
        var x = e.pageX || e.clientX + (document.documentElement.scrollLeft || document.body.scrollLeft);
        var y = e.pageY || e.clientY + (document.documentElement.scrollTop || document.body.scrollTop);
        return { x: x, y: y };
    };
    return ScrollEl;
}(utils_1.EventEmitter));
exports.default = ScrollEl;
