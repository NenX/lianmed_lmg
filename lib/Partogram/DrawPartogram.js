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
Object.defineProperty(exports, "__esModule", { value: true });
var DrawPartogram = (function () {
    function DrawPartogram(args) {
        var _this = this;
        this.maxindex = 750;
        this.lastx = 0;
        this.lasty = 0;
        this.baseleft = 50;
        this.basetop = 50;
        this.type = 0;
        this.isshowevent = 1;
        this.max = 210;
        this.start = '2019-09-01 05:30';
        this.demodata = [
            { checktime: '2019-09-01 07:01', cd: '3.5', df: '-2', event: '阴检' },
            { checktime: '2019-09-01 09:01', cd: '5', df: '0.5', event: '阴检' },
        ];
        this.lastcurrx = 0;
        this.currentx = 10;
        var canvas = args.canvas, canvas2 = args.canvas2, width = args.width, height = args.height;
        Object.assign(this, __assign(__assign({}, args), { width: width,
            height: height, context: canvas.getContext('2d'), context2: canvas2.getContext('2d') }));
        canvas.width = width;
        canvas.height = height;
        canvas2.width = width;
        canvas2.height = height;
        this.drawgrid();
        this.printline();
        this.canvas.addEventListener('click', function (e) {
            var p = _this.getEventPosition(e);
            alert(p);
        }, false);
    }
    DrawPartogram.prototype.showcur = function (x, fhr, toco) {
        var context = this.context;
        context.font = 'bold 10px consolas';
        context.textAlign = 'left';
        context.textBaseline = 'top';
        context.font = 'bold 16px arial';
        context.fillStyle = 'blue';
        var title = document.getElementById('curtitle');
        title.innerHTML = 'FHR1:' + fhr + '  ' + 'TOCO:' + toco;
    };
    DrawPartogram.prototype.selectfrom = function (lowValue, highValue) {
        var choice = highValue - lowValue + 1;
        return Math.floor(Math.random() * choice + lowValue);
    };
    DrawPartogram.prototype.setrules = function (x, align) {
        var _a = this, canvas = _a.canvas, context = _a.context;
        if (canvas == null)
            return false;
        context.font = 'bold 15px consolas';
        context.textAlign = align;
        context.textBaseline = 'top';
        context.fillStyle = 'rgba(0,51,102,1)';
        for (var i = 0; i < 11; i++) {
            context.fillText(String(10 - i), x, 45 + i * 40);
        }
        context.fillText('宫', 20, 100);
        context.fillText('颈', 20, 150);
        context.fillText('扩', 20, 200);
        context.fillText('张', 20, 250);
        context.fillText('(cm)', 32, 300);
        context.stroke();
        this.drawarc(15, 350);
        this.drawcross(930, 340);
    };
    DrawPartogram.prototype.drawarc = function (x, y) {
        var context = this.context;
        context.beginPath();
        context.arc(x, y, 8, 0, 2 * Math.PI);
        context.fillStyle = 'red';
        context.strokeStyle = 'red';
        context.fill();
        context.stroke();
    };
    DrawPartogram.prototype.drawcross = function (x, y) {
        var context = this.context;
        context.beginPath();
        context.fillStyle = '#394a6d';
        context.strokeStyle = '#394a6d';
        context.lineWidth = 0;
        context.moveTo(x, y);
        context.lineTo(x + 5, y);
        context.lineTo(x + 20, y + 15);
        context.lineTo(x + 15, y + 15);
        context.lineTo(x, y);
        context.moveTo(x + 15, y);
        context.lineTo(x + 20, y);
        context.lineTo(x + 5, y + 15);
        context.lineTo(x, y + 15);
        context.lineTo(x + 15, y);
        context.fill();
    };
    DrawPartogram.prototype.showevent = function (x, y, data) {
        var _a = this, isshowevent = _a.isshowevent, context = _a.context, basetop = _a.basetop;
        if (isshowevent && data != '') {
            context.textAlign = 'left';
            context.textBaseline = 'top';
            context.font = 'bold 14px arial';
            context.fillStyle = 'black';
            for (var i = 0; i < data.length; i++) {
                context.fillText(data.charAt(i), x, basetop + y + 15 * i);
            }
        }
    };
    DrawPartogram.prototype.setrrules = function (x, align) {
        var _a = this, canvas = _a.canvas, context = _a.context, type = _a.type;
        if (canvas == null)
            return false;
        context.font = 'bold 15px consolas';
        context.textAlign = align;
        context.textBaseline = 'top';
        context.fillStyle = 'rgba(0,51,102,1)';
        for (var i = 0; i < 11; i++) {
            var scale = 0;
            var stringScale = '';
            if (type == 0) {
                scale = 5 - i;
            }
            else {
                scale = i - 5;
            }
            stringScale = String(scale);
            if (scale > 0) {
                stringScale = '+' + scale;
            }
            context.fillText(stringScale, x, 45 + i * 40);
        }
        context.fillText('胎', 930, 120);
        context.fillText('头', 930, 170);
        context.fillText('下', 930, 220);
        context.fillText('降', 930, 270);
        context.stroke();
    };
    DrawPartogram.prototype.sethrules = function () {
        var _a = this, canvas = _a.canvas, context = _a.context, baseleft = _a.baseleft;
        if (canvas == null)
            return false;
        context.font = 'bold 15px consolas';
        context.textAlign = 'center';
        context.textBaseline = 'top';
        context.fillStyle = 'rgba(0,51,102,1)';
        for (var i = 1; i < 25; i++) {
            context.fillText(String(i), baseleft + i * 35, 5 + 450);
        }
        context.stroke();
    };
    DrawPartogram.prototype.setvertical = function (maxline) {
        var _a = this, canvas = _a.canvas, context = _a.context, baseleft = _a.baseleft, basetop = _a.basetop;
        if (canvas == null)
            return false;
        context.beginPath();
        context.strokeStyle = 'rgb(150,150,150)';
        context.lineWidth = 1;
        for (var i = 0; i < 10 + 1; i++) {
            context.moveTo(baseleft, basetop + 40 * i);
            context.lineTo(baseleft + 840, basetop + 40 * i);
        }
        context.stroke();
    };
    DrawPartogram.prototype.sethorizontal = function (length) {
        var _a = this, canvas = _a.canvas, context = _a.context, baseleft = _a.baseleft, basetop = _a.basetop;
        if (canvas == null)
            return false;
        context.beginPath();
        context.lineWidth = 1.1;
        context.strokeStyle = 'rgb(150,150,150)';
        for (var i = 0; i < 25; i++) {
            context.moveTo(35 * i + baseleft, basetop);
            context.lineTo(35 * i + baseleft, basetop + 400);
        }
        context.stroke();
    };
    DrawPartogram.prototype.converttime = function (start, current) {
        var interval = new Date(current).getTime() - new Date(start).getTime();
        interval = interval / 1000;
        return (interval / (60 * 60)).toFixed(1);
    };
    DrawPartogram.prototype.drawgrid = function () {
        this.sethorizontal(900);
        this.setvertical(900);
        this.setrules(40, 'right');
        this.setrrules(900, 'left');
        this.sethrules();
    };
    DrawPartogram.prototype.printline = function () {
        var _a = this, canvas2 = _a.canvas2, context2 = _a.context2, demodata = _a.demodata, baseleft = _a.baseleft, basetop = _a.basetop, start = _a.start, type = _a.type;
        context2.clearRect(0, 0, canvas2.width, canvas2.height);
        var lastx, lasty1, lasty2 = 0;
        for (var i = 0; i < demodata.length; i++) {
            var curx = baseleft + parseFloat(this.converttime(start, demodata[i].checktime)) * 35;
            var cury1 = basetop + (10 - Number(demodata[i].cd)) * 40;
            var cury2 = 0;
            if (type == 0) {
                cury2 = (5 - Number(demodata[i].df)) * 40;
            }
            else {
                cury2 = (5 + Number(demodata[i].df)) * 40;
            }
            this.drawarc(curx, cury1);
            this.drawcross(curx - 10, cury2);
            if (lastx != 0) {
                context2.beginPath();
                context2.lineWidth = 2.5;
                context2.strokeStyle = 'red';
                context2.moveTo(lastx, lasty1);
                context2.lineTo(curx, cury1);
                context2.stroke();
                context2.beginPath();
                context2.lineWidth = 2.5;
                context2.strokeStyle = '#394a6d';
                context2.moveTo(lastx, lasty2 + 5);
                context2.lineTo(curx, cury2 + 5);
                context2.stroke();
            }
            lastx = curx;
            lasty1 = cury1;
            lasty2 = cury2;
            this.showevent(curx, lasty1, demodata[i].event);
        }
    };
    DrawPartogram.prototype.setting = function (showtype) {
        this.isshowevent = Number(showtype);
        this.printline();
    };
    DrawPartogram.prototype.getEventPosition = function (ev) {
        var x, y;
        if (ev.layerX || ev.layerX == 0) {
            x = ev.layerX;
            y = ev.layerY;
        }
        else if (ev.offsetX || ev.offsetX == 0) {
            x = ev.offsetX;
            y = ev.offsetY;
        }
        return x + '-' + y;
    };
    DrawPartogram.prototype.formatDate = function (date, format) {
        if (!date)
            return;
        if (!format)
            format = 'yyyy-MM-dd';
        switch (typeof date) {
            case 'string':
                date = new Date(date.replace(/-/, '/'));
                break;
            case 'number':
                date = new Date(date);
                break;
        }
        if (!(date instanceof Date))
            return;
        var dict = {
            yyyy: date.getFullYear(),
            M: date.getMonth() + 1,
            d: date.getDate(),
            H: date.getHours(),
            m: date.getMinutes(),
            s: date.getSeconds(),
            MM: ('' + (date.getMonth() + 101)).substr(1),
            dd: ('' + (date.getDate() + 100)).substr(1),
            HH: ('' + (date.getHours() + 100)).substr(1),
            mm: ('' + (date.getMinutes() + 100)).substr(1),
            ss: ('' + (date.getSeconds() + 100)).substr(1),
        };
        return format.replace(/(yyyy|MM?|dd?|HH?|ss?|mm?)/g, function () {
            return dict[arguments[0]];
        });
    };
    return DrawPartogram;
}());
exports.DrawPartogram = DrawPartogram;
