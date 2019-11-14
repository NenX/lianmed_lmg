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
var BASE_INEVAL = 128;
var adu = 52;
var samplingrate = 128;
var points_one_times = 8;
var gride_width = 25;
var gx = points_one_times * ((gride_width * 5) / samplingrate);
var x_start = 25;
var ruler = [64, 64, 64, 64, 64, 64, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 64, 64, 64, 64, 64, 64];
var isstop = true;
var last_points = [
    [25, 100],
    [25, 200],
    [25, 300],
    [25, 400],
    [25, 500],
    [25, 600],
    [25, 700],
    [25, 800],
    [25, 900],
    [25, 1000],
    [25, 1100],
    [25, 1200],
];
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
            isstop = true;
            this.loop();
        }
    };
    DrawEcg.prototype._resize = function () {
        var _a = this, height = _a.height, width = _a.width;
        this.mode = height <= 50 ? displayMode.text : displayMode.canvas;
        Object.assign(this.canvas, { width: width, height: height });
        Object.assign(this.canvasline, { width: width, height: height });
        Object.assign(this.canvasmonitor, { width: width, height: height });
    };
    DrawEcg.prototype.destroy = function () {
        isstop = false;
    };
    DrawEcg.prototype.ecg = function () {
        this.addfilltext();
        this.initparm();
    };
    DrawEcg.prototype.Convert16Scale = function () {
    };
    DrawEcg.prototype.addfilltext = function () {
        var ctx = this.ctx;
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
        var datactx = this.datactx;
        this.log('resize text', this.canvasmonitor.width, this.canvasmonitor.height);
        if (this.height > 60) {
            var V = (this.height - 10) / 10;
            var H = (this.width - 10) / 20;
            var size = V > H ? H : V;
            this.log('ecg size', V, H, size);
            var D = 10;
            datactx.fillStyle = "#000";
            datactx.font = size + "px bold 黑体";
            datactx.textAlign = 'right';
            datactx.textAlign = "center";
            datactx.textBaseline = "middle";
            datactx.clearRect(0, 0, this.width, this.height);
            var keys = ['脉率', '血氧', '体温', '心率', '呼吸', '血压(S/D/M)'];
            datactx.fillText(' ' + keys[0] + '', size * 2, D);
            datactx.fillText(' ' + this.values[0] + '', size * 4, D);
            datactx.fillText(' ' + keys[1] + '', size * 8, D);
            datactx.fillText(' ' + this.values[1] + '', size * 10, D);
            datactx.fillText(' ' + keys[2] + '', size * 2, D + V);
            datactx.fillText(' ' + this.values[2] + '', size * 4, D + V);
            datactx.fillText(' ' + this.values[3] + '', size * 8, D + V);
            datactx.fillText(' ' + keys[3] + '', size * 2, D + 2 * V);
            datactx.fillText(' ' + this.values[4] + '', size * 4, D + 2 * V);
            datactx.fillText(' ' + keys[4] + '', size * 8, D + 2 * V);
            datactx.fillText(' ' + this.values[5] + '', size * 10, D + 2 * V);
            datactx.fillText(' ' + keys[5] + '', size * 4, D + 3 * V);
            datactx.fillText(' ' + this.values[6] + '', size * 10, D + 3 * V);
        }
        else {
            var size = 16;
            var D = 10;
            datactx.fillStyle = "#000";
            datactx.font = size + "px bold 黑体";
            datactx.textAlign = 'right';
            datactx.textAlign = "center";
            datactx.textBaseline = "middle";
            datactx.clearRect(0, 0, this.width, this.height);
            var keys = ['脉率', '血氧', '体温', '心率', '呼吸', '血压(S/D/M)'];
            datactx.fillText(' ' + keys[0] + '', size * 2, D);
            datactx.fillText(' ' + this.values[0] + '', size * 4, D);
            datactx.fillText(' ' + keys[1] + '', size * 8, D);
            datactx.fillText(' ' + this.values[1] + '', size * 10, D);
            datactx.fillText(' ' + keys[2] + '', size * 12, D);
            datactx.fillText(' ' + this.values[2] + '', size * 14, D);
            datactx.fillText(' ' + this.values[3] + '', size * 18, D);
            datactx.fillText(' ' + keys[3] + '', size * 32, D);
            datactx.fillText(' ' + this.values[4] + '', size * 24, D);
            datactx.fillText(' ' + keys[4] + '', size * 28, D);
            datactx.fillText(' ' + this.values[5] + '', size * 30, D);
            datactx.fillText(' ' + keys[5] + '', size * 34, D);
            datactx.fillText(' ' + this.values[6] + '', size * 40, D);
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
        var _a = this, width = _a.width, linectx = _a.linectx;
        if (width < 150) {
            alert(' width is limited');
        }
        else {
            this.max_times = Math.floor((width - 25) / gx);
        }
        linectx.strokeStyle = '#9d6003';
    };
    DrawEcg.prototype.loop = function () {
        var mode = this.mode;
        var y_starts = this.GetYStarts(12);
        if (mode === displayMode.text) {
            this.DrawDatatext();
        }
        else {
            this.datactx.clearRect(0, 0, this.width, this.height);
        }
        this.log('resize loop ', mode, this.mode);
        this.current_time_millis = +new Date();
        if ((!isNaN(this.start) || this.oQueue.GetSize() > points_one_times * 5) && mode === displayMode.canvas) {
            this.start = 1;
            this.drawsingle(y_starts, adu, samplingrate, this.max_times, this.linectx);
        }
        if (isstop) {
            setTimeout(this.loop.bind(this), loopmill);
        }
        if (this.oQueue.IsEmpty()) {
            this.Convert16Scale();
        }
    };
    DrawEcg.prototype.drawsingle = function (Q, P, N, G, A) {
        var oQueue = this.oQueue;
        this.current_times = this.current_times % G;
        if (oQueue.IsEmpty()) {
            this.start = NaN;
            return;
        }
        if (oQueue.GetSize() < points_one_times) {
            this.start = NaN;
            return;
        }
        this.clearcanvans(this.current_times, points_one_times, N, A);
        var F = [];
        for (var J = 0; J < points_one_times; J++) {
            F.push(oQueue.DeQueue());
        }
        A.beginPath();
        for (var K = 0; K < F.length; K++) {
            var C = F[K] - BASE_INEVAL;
            var I = K * (gride_width * 5 / N);
            var M = void 0;
            A.strokeStyle = '#9d6003';
            if (this.ecg_scope != 0) {
                M = Math.abs(C) * (P / (gride_width * 2)) * this.ecg_scope;
            }
            else {
                M = (Math.abs(C) * (P / (gride_width * 2))) / 2;
            }
            var L = x_start + this.current_times * points_one_times * ((gride_width * 5) / N);
            if (K == 0) {
                if (this.current_times != 0) {
                    A.moveTo(last_points[0][0], last_points[0][1]);
                    var D = parseFloat(C >= 0 ? Q[0] - M : Q[0] + M);
                    A.lineTo(last_points[0][0], D);
                    last_points[0][0] = last_points[0][0];
                    last_points[0][1] = D;
                }
                else {
                    var D = parseFloat(C >= 0 ? Q[0] - M : Q[0] + M);
                    A.moveTo(x_start, D);
                    last_points[0][0] = x_start;
                    last_points[0][1] = D;
                }
            }
            else {
                A.moveTo(last_points[0][0], D);
                var D = parseFloat(C >= 0 ? Q[0] - M : Q[0] + M);
                A.lineTo(L + I, D);
                last_points[0][0] = L + I;
                last_points[0][1] = D;
            }
        }
        A.stroke();
        this.current_times++;
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
                B[A] = -BASE_INEVAL / 2 + A * 100;
            }
            else {
                B[A] = -BASE_INEVAL / 2 + A * 100;
            }
        }
        return B;
    };
    DrawEcg.Queue = Queue_1.default;
    return DrawEcg;
}(Draw_1.default));
exports.DrawEcg = DrawEcg;
