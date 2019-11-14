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
var sid = 0;
var Draw = (function (_super) {
    __extends(Draw, _super);
    function Draw() {
        var _this = _super.call(this) || this;
        _this.sid = sid++;
        _this.log = console.log.bind(console, _this.constructor.name, _this.sid);
        console.log('resize', _this);
        return _this;
    }
    Draw.prototype.destroy = function () { };
    Draw.prototype.init = function (data) { };
    Draw.prototype.resize = function () {
        var rect = this.wrap.getBoundingClientRect();
        var width = rect.width, height = rect.height;
        this.width = width;
        this.height = height;
        this._resize();
    };
    Draw.prototype._resize = function () {
    };
    return Draw;
}(utils_1.EventEmitter));
exports.default = Draw;
