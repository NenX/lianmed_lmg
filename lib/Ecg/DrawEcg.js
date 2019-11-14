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
var Draw_1 = __importDefault(require("../Draw"));
var Queue_1 = __importDefault(require("./Queue"));
var utils_1 = require("@lianmed/utils");
var BASE_INEVAL = 128;
var adu = 52;
var samplingrate = 128;
var points_one_times = 9;
var gride_width = 25;
var gx = points_one_times * ((gride_width * 5) / samplingrate);
var x_start = 25;
var ruler = [64, 64, 64, 64, 64, 64, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 64, 64, 64, 64, 64, 64];
var isstop = true;
var loopmill = 100;
var displayMode;
(function (displayMode) {
    displayMode[displayMode["canvas"] = 0] = "canvas";
    displayMode[displayMode["text"] = 1] = "text";
})(displayMode || (displayMode = {}));
var DrawEcg = (function (_super) {
    __extends(DrawEcg, _super);
    function DrawEcg(args) {
        var _this = _super.call(this) || this;
        _this.mode = displayMode.canvas;
        _this.oQueue = new Queue_1.default();
        _this.values = [100, 120, 37.5, 38, 50, 80, '100/69/120'];
        _this.ecg_scope = 1;
        _this.current_times = 0;
        _this.max_times = 135;
        _this.current_time_millis = 0;
        _this.start = NaN;
        _this.intervalIds = [];
        var canvas = args.canvas, canvasline = args.canvasline, canvasmonitor = args.canvasmonitor;
        var width = canvas.width, height = canvas.height;
        Object.assign(_this, __assign(__assign({}, args), { width: width,
            height: height, ctx: canvas.getContext('2d'), linectx: canvasline.getContext('2d'), datactx: canvasmonitor.getContext('2d') }));
        _this.ecg();
        return _this;
    }
    DrawEcg.prototype.init = function (data) {
        if (data) {
            this.oQueue = data.ecg;
            this.values = data.ecgdata;
            this.current_time_millis = 0;
            this.current_times = 0;
            isstop = false;
            console.log("loop");
            this.last_points = [];
            this.timerEcg(loopmill);
        }
    };
    DrawEcg.prototype._resize = function () {
        var _a = this, height = _a.height, width = _a.width;
        this.mode = height <= 50 ? displayMode.text : displayMode.canvas;
        Object.assign(this.canvas, { width: width, height: height });
        Object.assign(this.canvasline, { width: width, height: height });
        Object.assign(this.canvasmonitor, { width: width, height: height });
        this.addfilltext();
        this.initparm();
    };
    DrawEcg.prototype.destroy = function () {
        isstop = false;
        this.intervalIds.forEach(function (_) { return clearInterval(_); });
        this.canvas = null;
        this.canvasline = null;
        this.canvasmonitor = null;
    };
    DrawEcg.prototype.ecg = function () {
        this.addfilltext();
        this.initparm();
    };
    DrawEcg.prototype.Convert16Scale = function () {
    };
    DrawEcg.prototype.addfilltext = function () {
        var _a = this, ctx = _a.ctx, canvas = _a.canvas;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.font = 'bold 14px';
        ctx.fillText('' + 'I' + '', 10, 10);
        var scale = 1;
        ctx.strokeStyle = '#006003';
        ctx.beginPath();
        ctx.moveTo(x_start * 2, ruler[0] * scale);
        for (var i = 0; i < ruler.length; i++) {
            ctx.lineTo(i + x_start * 2, ruler[i] * scale);
        }
        ctx.stroke();
    };
    DrawEcg.prototype.DrawDatatext = function () {
        var _a = this, datactx = _a.datactx, values = _a.values, height = _a.height, width = _a.width;
        var keys = ['脉率', '血氧', '体温', '心率', '呼吸', '血压(S/D/M)'];
        var v = Object.assign(Array(7).fill('--'), values);
        v[3] = v[3] + " ~ " + v[4];
        v.splice(4, 1);
        var entries = utils_1._R.zip(keys, v);
        datactx.clearRect(0, 0, width, height);
        if (height > 60) {
            var V_1 = (height) / 6;
            var size_1 = V_1 / 2;
            var D_1 = 10;
            datactx.fillStyle = "#000";
            datactx.font = size_1 + "px bold 黑体";
            datactx.textAlign = 'right';
            datactx.textAlign = "center";
            datactx.textBaseline = "middle";
            entries.forEach(function (_a, i) {
                var k = _a[0], v = _a[1];
                var isRight = i > 2;
                var x = (isRight ? 10 : 20);
                var y = D_1 + (i % 3) * V_1 + 4 * size_1;
                datactx.fillText(" " + k, width - size_1 * x, y);
                datactx.fillText(" " + v, width - size_1 * (x - 5), y);
            });
        }
        else {
            var d_1 = width / 6;
            var size = 16;
            var D_2 = 14;
            datactx.fillStyle = "#eee";
            datactx.fillRect(0, 0, width, height);
            datactx.fillStyle = "#666";
            datactx.font = size + "px bold 黑体";
            datactx.textAlign = "center";
            datactx.textBaseline = "middle";
            entries.forEach(function (_a, i) {
                var k = _a[0], v = _a[1];
                var x = 20 + d_1 * i;
                datactx.fillText(" " + k, x, D_2);
                datactx.fillText(" " + (v || ''), x, 2.5 * D_2);
            });
        }
    };
    DrawEcg.prototype.adddata = function (F, C, E, J) {
        var _a = this, MultiParam = _a.MultiParam, Ple = _a.Ple, Tre = _a.Tre;
        for (var index = 0; index < 360; index++) {
            var G = new Array(3);
            G[0] = (MultiParam[(index * 2) % 375] + 128) * 0.1;
            G[1] = Ple[index % 60];
            G[2] = Tre[index % 180];
            this.oQueue.EnQueue(G);
        }
        return;
    };
    DrawEcg.prototype.initparm = function () {
        var _a = this, canvasline = _a.canvasline, linectx = _a.linectx;
        if (canvasline.width < 150) {
            alert(' width is limited');
        }
        else {
            this.max_times = Math.floor((canvasline.width - 25) * 0.6 / gx);
        }
        console.log('ecg-width', canvasline.width);
        linectx.strokeStyle = '#9d6003';
    };
    DrawEcg.prototype.timerEcg = function (dely) {
        var _this = this;
        var id = setInterval(function () {
            if (!_this) {
                clearInterval(id);
            }
            _this.DrawDatatext();
            var A = new Date().getTime();
            _this.current_time_millis = A;
            if (!isNaN(_this.start) || _this.oQueue.GetSize() > points_one_times * 5) {
                _this.start = 1;
                _this.drawsingle();
            }
        }, dely);
        this.intervalIds.push(id);
    };
    DrawEcg.prototype.drawsingle = function () {
        var _a = this, oQueue = _a.oQueue, last_points = _a.last_points, max_times = _a.max_times, linectx = _a.linectx;
        var y_starts = this.GetYStarts(12);
        if (isstop) {
            return;
        }
        isstop = true;
        this.current_times = this.current_times % max_times;
        if (oQueue.IsEmpty()) {
            this.start = NaN;
            isstop = false;
            return;
        }
        if (oQueue.GetSize() < points_one_times) {
            this.start = NaN;
            isstop = false;
            return;
        }
        this.clearcanvans(this.current_times, points_one_times, samplingrate, linectx);
        var F = [];
        for (var J = 0; J < points_one_times; J++) {
            F.push(oQueue.DeQueue());
        }
        var L = x_start + this.current_times * points_one_times * ((gride_width * 5) / samplingrate);
        linectx.beginPath();
        for (var K = 0; K < F.length; K++) {
            var C = F[K] - BASE_INEVAL;
            var I = K * (gride_width * 5 / samplingrate);
            var M = void 0;
            linectx.strokeStyle = '#9d6003';
            if (this.ecg_scope != 0) {
                M = Math.abs(C) * (adu / (gride_width * 2)) * this.ecg_scope;
            }
            else {
                M = (Math.abs(C) * (adu / (gride_width * 2))) / 2;
            }
            if (K == 0) {
                if (this.current_times != 0) {
                    linectx.moveTo(last_points[0], last_points[1]);
                    var D = parseFloat(C >= 0 ? y_starts[0] - M : y_starts[0] + M);
                    linectx.lineTo(last_points[0], D);
                    last_points[0] = last_points[0];
                    last_points[1] = D;
                }
                else {
                    var D = parseFloat(C >= 0 ? y_starts[0] - M : y_starts[0] + M);
                    linectx.moveTo(x_start, D);
                    last_points[0] = x_start;
                    last_points[1] = D;
                }
            }
            else {
                linectx.moveTo(last_points[0], last_points[1]);
                var D = parseFloat(C >= 0 ? y_starts[0] - M : y_starts[0] + M);
                linectx.lineTo(L + I, D);
                if (L + I < last_points[0]) {
                    console.log('error data', this.current_times, L, I, K, last_points);
                }
                last_points[0] = L + I;
                last_points[1] = D;
            }
        }
        linectx.stroke();
        this.current_times++;
        isstop = false;
    };
    DrawEcg.prototype.clearcanvans = function (B, F, C, D) {
        var A = F * ((gride_width * 5) / C);
        var E = x_start + B * A;
        if (B != 0) {
            D.clearRect(E, 0, 20, this.height);
        }
        else {
            D.clearRect(E - 10, 0, E + 20, this.height);
        }
    };
    DrawEcg.prototype.GetYStarts = function (C) {
        var height = this.height;
        var B = [];
        for (var A = 0; A < C; A++) {
            if (height < 480) {
                B[A] = -BASE_INEVAL / 2 + A * 100 - 20 + 0.3 * height;
            }
            else {
                B[A] = -BASE_INEVAL / 2 + A * 100 - 20 + 0.3 * height;
            }
        }
        return B;
    };
    DrawEcg.Queue = Queue_1.default;
    return DrawEcg;
}(Draw_1.default));
exports.DrawEcg = DrawEcg;
