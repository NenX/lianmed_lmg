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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var DrawCTG_1 = __importDefault(require("./DrawCTG"));
var request_1 = __importDefault(require("@lianmed/request"));
var lodash_1 = require("lodash");
var Draw_1 = __importDefault(require("../Draw"));
var sid = 0;
var Suit = (function (_super) {
    __extends(Suit, _super);
    function Suit(canvasgrid, canvasdata, canvasline, canvasselect, canvasanalyse, wrap, barTool, type) {
        var _this = _super.call(this) || this;
        _this.option = Suit.option;
        _this.initFlag = false;
        _this.sid = sid++;
        _this.log = console.log.bind(console, 'suit', _this.sid);
        _this.intervalIds = [];
        _this.starttime = '2019-09-26';
        _this.fetalcount = 1;
        _this.type = 0;
        _this.currentdot = 10;
        _this.currentx = 10;
        _this.viewposition = 0;
        _this.scollscale = 1;
        _this.buffersize = 16;
        _this.curr = -16;
        _this.ctgconfig = {
            normalarea: 'rgb(224,255,255)',
            selectarea: 'rgba(192,192,192,0.5)',
            rule: 'rgba(0,51,102,1)',
            scale: 'rgba(0,0,0,1)',
            primarygrid: 'rgba(144, 159, 180,1)',
            secondarygrid: 'rgba(221, 230, 237,1)',
            fhrcolor: ['green', 'blue', 'rgb(0,0,0)'],
            tococolor: 'rgb(0,0,0)',
            alarmcolor: 'rgb(255, 1, 1)',
            alarm_enable: true,
            alarm_high: 160,
            alarm_low: 110,
        };
        _this.fetalposition = {
            fhr1: '',
            fhr2: '',
            fhr3: ''
        };
        _this.printlen = 4800;
        _this.selectstart = 0;
        _this.selectrpstart = 0;
        _this.selectend = 0;
        _this.selectrpend = 0;
        _this.selectflag = false;
        _this.requestflag = false;
        _this.dragtimestamp = 0;
        _this.interval = 5000;
        _this.lazyEmit = lodash_1.throttle(function (type) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            console.log("Suit:" + type);
            _this.emit.apply(_this, __spreadArrays([type], args));
            return true;
        }, _this.emitInterval || 2000);
        _this.wrap = wrap;
        _this.canvasgrid = canvasgrid;
        _this.canvasdata = canvasdata;
        _this.canvasline = canvasline;
        _this.canvasselect = canvasselect;
        _this.canvasanalyse = canvasanalyse;
        _this.contextgrid = canvasgrid.getContext('2d');
        _this.contextdata = canvasdata.getContext('2d');
        _this.contextline = canvasline.getContext('2d');
        _this.contextselect = canvasselect.getContext('2d');
        _this.contextanalyse = canvasanalyse.getContext('2d');
        _this.barTool = barTool;
        _this.drawobj = new DrawCTG_1.default(_this);
        _this.type = type;
        _this.barTool.watchGrab(function (value) {
        });
        _this.ctgconfig.tococolor = _this.option.tococolor;
        _this.ctgconfig.fhrcolor[0] = _this.option.fhrcolor1;
        _this.ctgconfig.fhrcolor[1] = _this.option.fhrcolor2;
        _this.ctgconfig.fhrcolor[2] = _this.option.fhrcolor3;
        if (_this.option.alarm_enable == "0") {
            _this.ctgconfig.alarm_enable = false;
        }
        else {
            _this.ctgconfig.alarm_enable = true;
        }
        _this.ctgconfig.alarm_enable = true;
        _this.ctgconfig.alarm_high = Number(_this.option.alarm_high);
        _this.ctgconfig.alarm_low = Number(_this.option.alarm_low);
        return _this;
    }
    Suit.prototype.init = function (data) {
        var _this = this;
        if (!data) {
            return;
        }
        this.log('init', data);
        this.initFlag = true;
        var defaultinterval = 500;
        this.data = data;
        this.fetalcount = data.fetal_num;
        this.currentdot = data.index;
        if (!data.status) {
            this.type = 1;
            if (typeof (data.index) == 'undefined') {
                this.data = this.InitFileData(data);
                this.fetalcount = this.data.fetal_num;
            }
        }
        if (this.type > 0) {
            console.log(this.data);
            if (this.data.index > this.canvasline.width * 2) {
                this.curr = this.canvasline.width * 2;
                console.log('type_check', this.canvasline.width, this.canvasline.width * 2, this.data.index);
                this.barTool.setBarWidth(100);
                this.barTool.setBarLeft(0, false);
            }
            else {
                this.curr = this.data.index;
            }
            this.barTool.setBarWidth(0);
            this.drawobj.drawdot(this.canvasline.width * 2);
            this.viewposition = this.curr;
            this.createBar();
        }
        else {
            this.drawobj.drawgrid(0);
            this.barTool.setBarWidth(0);
            this.timerCtg(defaultinterval);
        }
        this.barTool.watch(function (value) {
            _this.dragtimestamp = new Date().getTime();
            if (_this.curr > _this.canvasline.width * 4) {
                _this.viewposition = _this.canvasline.width * 2 + Math.floor((_this.curr - _this.canvasline.width * 2) * value / (_this.canvasline.width - 100));
            }
            else {
                _this.viewposition = value + _this.curr;
            }
            if (_this.viewposition < _this.canvasline.width * 2) {
                _this.drawobj.drawdot(_this.canvasline.width * 2);
                return;
            }
            _this.drawobj.drawdot(_this.viewposition);
        });
        this.barTool.watchGrab(function (value) {
            if (_this.type == 0 && _this.data.past > 0) {
                if (!_this.requestflag) {
                    _this.requestflag = true;
                    _this.getoffline(_this.data.docid, _this.data.past);
                }
            }
            if (_this.data.index < _this.canvasline.width * 2) {
                return;
            }
            _this.dragtimestamp = new Date().getTime();
            if (_this.viewposition - value < _this.canvasline.width * 2) {
                _this.viewposition = _this.canvasline.width * 2;
                _this.drawobj.drawdot(_this.viewposition);
                if (_this.selectflag) {
                    if (_this.selectend == 1) {
                        _this.endingBar.setOffset(_this.canvasline.width - Math.floor((_this.viewposition - _this.selectrpend) / 2));
                    }
                    _this.drawobj.showselect(_this.selectrpstart, _this.selectrpend);
                }
                return;
            }
            console.log('print_drag1', value, _this.viewposition, _this.selectrpend);
            if (_this.viewposition - value < _this.data.index) {
                _this.viewposition -= value;
                _this.drawobj.drawdot(_this.viewposition);
            }
            else {
                _this.viewposition = _this.data.index;
                _this.drawobj.drawdot(_this.viewposition);
                console.log('print_drag--', _this.viewposition);
            }
            if (_this.selectflag) {
                console.log('print_drag2', value, _this.viewposition, _this.selectrpend, Math.floor((_this.viewposition - _this.selectrpend)) / 2);
                if (_this.selectend == 1 && _this.viewposition - _this.selectrpend > -2) {
                    _this.endingBar.setVisibility(true);
                    _this.endingBar.setOffset(_this.canvasline.width - Math.floor((_this.viewposition - _this.selectrpend) / 2));
                }
                else {
                    _this.endingBar.setVisibility(false);
                }
                _this.drawobj.showselect(_this.selectrpstart, _this.selectrpend);
            }
        });
    };
    Suit.prototype.alarmOn = function (alarmType) {
        if (alarmType === void 0) { alarmType = ''; }
        this.lazyEmit('alarmOn', alarmType);
    };
    Suit.prototype.alarmOff = function (alarmType) {
        this.lazyEmit('alarmOff', alarmType);
    };
    Suit.prototype.createBar = function () {
        var _this = this;
        if (this.startingBar && this.endingBar) {
            return;
        }
        var barTool = this.barTool;
        var startingBar = this.startingBar = barTool.createRod('');
        var endingBar = this.endingBar = barTool.createRod('结束');
        startingBar.setOffset(0);
        endingBar.toggleVisibility();
        startingBar.on('change', function (value) {
            _this.selectrpstart = value * 2;
            console.log('print_开始', value, _this.viewposition, _this.canvasline.width);
            if (_this.viewposition > _this.canvasline.width * 2) {
                _this.selectstart = value * 2 + _this.viewposition - 2 * _this.canvasline.width;
            }
            else {
                _this.selectstart = value * 2;
            }
            _this.drawobj.showcur(_this.selectstart);
            _this.selectrpstart = _this.selectstart;
            _this.emit('startTime', _this.selectstart);
        });
        endingBar.on('change', function (value) {
            if (_this.data.index < _this.canvasline.width * 2) {
                _this.selectrpend = value * 2;
            }
            else {
                _this.selectrpend = _this.viewposition - (_this.canvasline.width - value) * 2;
            }
            if (_this.selectrpstart > _this.selectrpend) {
                return;
            }
            console.log('print_结束', value, _this.selectrpstart, _this.selectrpend);
            _this.drawobj.showselect(_this.selectrpstart, _this.selectrpend);
            _this.emit('endTime', _this.selectrpend);
        });
        this.on('locking', function (value) {
            console.log('print_locking', value);
            _this.selectflag = value;
            if (_this.selectflag) {
                _this.startingBar.toggleVisibility();
                _this.barTool.setBarWidth(0);
                _this.selectend = 0;
                console.log('print_lock', _this.selectstart, _this.data.index);
                _this.selectrpend = _this.data.index < _this.selectrpstart + _this.printlen ? _this.data.index : _this.selectrpstart + _this.printlen;
                _this.drawobj.showselect(_this.selectrpstart, _this.selectrpend);
                _this.endingBar.setVisibility(false);
                _this.emit('endTime', _this.selectrpend);
            }
            else {
                _this.startingBar.toggleVisibility();
                _this.endingBar.setVisibility(false);
                console.log(_this.selectstart, _this.data.index);
                _this.drawobj.showselect(0, 0);
            }
        })
            .on('customizing', function (value) {
            _this.log('customizing', value, _this.selectrpend, _this.viewposition);
            if (value && _this.selectflag) {
                _this.selectend = 1;
                if (_this.data.index < _this.canvasline.width * 2) {
                    _this.endingBar.setVisibility(true);
                    _this.endingBar.setOffset(Math.floor(_this.viewposition / 2));
                }
                else if (_this.viewposition - _this.selectrpend >= 0) {
                    _this.endingBar.setVisibility(true);
                    _this.endingBar.setOffset(_this.canvasline.width - Math.floor((_this.viewposition - _this.selectrpend) / 2));
                }
            }
            else {
                _this.selectend = 0;
                _this.endingBar.setVisibility(false);
            }
        })
            .on('setStartingTime', function (value) {
            _this.log('setStartingTime', value);
        })
            .on('setEndingTime', function (value) {
            _this.log('setEndingTime', value);
        });
    };
    Suit.prototype.lockStartingBar = function (status) {
        console.log('lockStartingBar', status);
    };
    Suit.prototype.destroy = function () {
        this.log('destroy');
        this.intervalIds.forEach(function (_) { return clearInterval(_); });
        this.canvasgrid = null;
        this.canvasdata = null;
        this.contextgrid = null;
        this.contextdata = null;
        this.canvasline = null;
        this.contextline = null;
        this.canvasselect = null;
        this.contextselect = null;
        this.canvasanalyse = null;
        this.contextanalyse = null;
        this.wrap = null;
        this.drawobj = null;
        this.barTool = null;
    };
    Suit.prototype.resize = function () {
        this.log('resize');
        this.drawobj.resize();
    };
    Suit.prototype.setfetalposition = function (fhr1, fhr2, fhr3) {
        this.fetalposition.fhr1 = fhr1;
        this.fetalposition.fhr2 = fhr2;
        this.fetalposition.fhr3 = fhr3;
    };
    Suit.prototype.movescoller = function () { };
    Suit.prototype.InitFileData = function (oriobj) {
        var pureidarr = oriobj.docid.split('_');
        var CTGDATA = { fhr: [[], [], []], toco: [], fm: [], fetal_num: 2, index: 0, starttime: '', analyse: { acc: [], dec: [], baseline: [], start: 0, end: 0 } };
        if (pureidarr.length > 2) {
            var pureid = pureidarr[2].split('');
            var t_1 = ["-", "-", " ", ":", ":", ""];
            CTGDATA.starttime = '20' + pureid.reduce(function (a, b, i) {
                return "" + a + b + (i & 1 ? t_1[~~(i / 2)] : '');
            }, '');
        }
        Object.keys(oriobj).forEach(function (key) {
            var oridata = oriobj[key];
            if (!oridata || oridata === '') {
                return false;
            }
            if (key === 'docid') {
                return false;
            }
            if (key === 'analyse') {
                Object.assign(CTGDATA.analyse, formatAnalyseData(oridata));
                return;
            }
            if (key === 'fhr1') {
                CTGDATA.index = oridata.length / 2;
            }
            for (var i = 0; i < CTGDATA.index; i++) {
                if (typeof (oridata) != "string" || oridata.length < 2) {
                    return;
                }
                var hexBits = oridata.substring(0, 2);
                var data_to_push = parseInt(hexBits, 16);
                if (key === 'fhr1') {
                    CTGDATA.fhr[0][i] = data_to_push;
                }
                else if (key === 'fhr2') {
                    CTGDATA.fhr[1][i] = data_to_push;
                }
                else if (key === 'fhr3') {
                    CTGDATA.fhr[2][i] = data_to_push;
                }
                else if (key === 'toco') {
                    CTGDATA.toco[i] = data_to_push;
                }
                else if (key === 'fm') {
                    CTGDATA.fm[i] = data_to_push;
                }
                oridata = oridata.substring(2, oridata.length);
            }
        });
        return CTGDATA;
    };
    Suit.prototype.drawdot = function () {
        if (this.data.starttime && this.data.starttime != '' && this.data.status == 1 && this.data.index > 0) {
            if (isNaN(this.data.csspan))
                return;
            this.curr = (Math.floor(new Date().getTime() / 1000) - Math.floor(new Date(this.data.starttime).getTime() / 1000)) * 4 + this.data.csspan;
            if (this.curr < 0)
                return;
            this.drawobj.drawdot(this.curr);
            this.viewposition = this.curr;
            if (this.data.index > this.canvasline.width * 2) {
                if (this.data.index < this.canvasline.width * 4) {
                    var len = Math.floor((this.canvasline.width * 4 - this.data.index) / 2);
                    this.barTool.setBarWidth(len);
                }
                else {
                    this.barTool.setBarWidth(100);
                }
                this.barTool.setBarLeft(this.canvasline.width, false);
            }
        }
        else {
            this.drawobj.showcur(this.data.index + 2);
            this.drawobj.drawdot(this.data.index + 2);
        }
    };
    Suit.prototype.timerCtg = function (dely) {
        var _this = this;
        var id = setInterval(function () {
            if (!_this) {
                clearInterval(id);
            }
            var curstamp = new Date().getTime();
            if (curstamp - _this.dragtimestamp > _this.interval) {
                _this.drawdot();
            }
        }, dely);
        this.intervalIds.push(id);
    };
    Suit.prototype.onStatusChange = function (status) {
        return status;
    };
    Suit.prototype.getoffline = function (doc_id, offlineend) {
        var _this = this;
        request_1.default.get("/ctg-exams-data/" + doc_id).then(function (responseData) {
            console.log(doc_id, offlineend, responseData, _this.data.past);
            if (responseData) {
                _this.initfhrdata(responseData, _this.data, offlineend);
                _this.data.past = 0;
                _this.requestflag = false;
            }
        });
    };
    Suit.prototype.initfhrdata = function (data, datacache, offindex) {
        Object.keys(data).forEach(function (key) {
            var oridata = data[key];
            if (!oridata) {
                return;
            }
            for (var i = 0; i < offindex; i++) {
                var hexBits = oridata.substring(0, 2);
                var data_to_push = parseInt(hexBits, 16);
                if (key === 'fhr1') {
                    datacache.fhr[0][i] = data_to_push;
                }
                else if (key === 'fhr2') {
                    if (datacache.fhr[1])
                        datacache.fhr[1][i] = data_to_push;
                }
                else if (key === 'fhr3') {
                    if (datacache.fhr[2])
                        datacache.fhr[2][i] = data_to_push;
                }
                else if (key === 'toco') {
                    datacache.toco[i] = data_to_push;
                }
                else if (key === "fm") {
                    datacache.fm[i] = data_to_push;
                }
                oridata = oridata.substring(2, oridata.length);
            }
        });
    };
    Suit.option = {};
    return Suit;
}(Draw_1.default));
exports.Suit = Suit;
function formatAnalyseData(obj) {
    var keys = ['acc', 'baseline', 'dec', 'meanbaseline'];
    var arr = Object.entries(obj)
        .filter(function (_a) {
        var k = _a[0], v = _a[1];
        return keys.includes(k);
    })
        .map(function (_a) {
        var k = _a[0], v = _a[1];
        v = typeof v === 'string' ? v : '';
        return [k, v.split(',').map(function (_) { return parseInt(_); }).filter(function (_) { return !isNaN(_); })];
    });
    return __assign(__assign({}, obj), arr.reduce(function (a, _a) {
        var _b;
        var k = _a[0], v = _a[1];
        return Object.assign(a, (_b = {}, _b[k] = v, _b));
    }, {}));
}
