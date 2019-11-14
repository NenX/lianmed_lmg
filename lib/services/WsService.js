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
var utils_1 = require("@lianmed/utils");
var request_1 = __importDefault(require("@lianmed/request"));
var Queue_1 = __importDefault(require("../Ecg/Queue"));
var lodash_1 = require("lodash");
var ANNOUNCE_INTERVAL = 500;
var EWsStatus;
(function (EWsStatus) {
    EWsStatus[EWsStatus["Pendding"] = 0] = "Pendding";
    EWsStatus[EWsStatus["Success"] = 1] = "Success";
    EWsStatus[EWsStatus["Error"] = 2] = "Error";
})(EWsStatus = exports.EWsStatus || (exports.EWsStatus = {}));
var BedStatus;
(function (BedStatus) {
    BedStatus[BedStatus["Working"] = 1] = "Working";
    BedStatus[BedStatus["Stopped"] = 2] = "Stopped";
    BedStatus[BedStatus["Offline"] = 3] = "Offline";
})(BedStatus = exports.BedStatus || (exports.BedStatus = {}));
var Working = BedStatus.Working, Stopped = BedStatus.Stopped, Offline = BedStatus.Offline;
var getEmptyCacheItem = function () {
    return {
        fhr: [],
        toco: [],
        fm: [],
        index: 0,
        length: 0,
        start: -1,
        last: 0,
        past: 0,
        timestamp: 0,
        docid: '',
        status: Offline,
        orflag: true,
        starttime: '',
        pregnancy: '',
        fetal_num: 1,
        csspan: NaN,
        ecg: new Queue_1.default(),
        ecgdata: [],
    };
};
var WsService = (function (_super) {
    __extends(WsService, _super);
    function WsService(settingData) {
        var _this_1 = _super.call(this) || this;
        _this_1.isReady = false;
        _this_1.dirty = false;
        _this_1.interval = 10000;
        _this_1.RECONNECT_INTERVAL = 10000;
        _this_1.span = NaN;
        _this_1.offQueue = new Queue_1.default();
        _this_1.offstart = false;
        _this_1.log = console.log.bind(console, 'websocket');
        _this_1.datacache = new Map();
        _this_1.refreshInterval = 2000;
        _this_1.refreshTimeout = null;
        _this_1.tip = function (text, status) {
            _this_1.log(text);
            _this_1.dispatch({
                type: 'ws/setState',
                payload: { status: status }
            });
        };
        _this_1.connect = function () {
            var _a = _this_1, datacache = _a.datacache, settingData = _a.settingData;
            var ws_url = settingData.ws_url;
            _this_1.tip('连接中', EWsStatus.Pendding);
            if (!ws_url)
                return Promise.reject('错误的ws_url');
            _this_1.socket = new WebSocket("ws://" + ws_url + "/?clientType=ctg-suit&token=eyJ1c2VybmFtZSI6ICJhZG1pbiIsInBhc3N3b3JkIjogImFkbWluIn0=");
            var socket = _this_1.socket;
            return new Promise(function (res) {
                socket.onerror = function () {
                    _this_1.log('错误');
                };
                socket.onopen = function (event) {
                    _this_1.offrequest = 0;
                    _this_1.dirty && location.reload();
                    _this_1.send('{"name":"heard","data":{"time":' +
                        191001180000 +
                        ',"index":0}}');
                    _this_1.settingData.area_devices && _this_1.send(JSON.stringify({
                        name: "area_devices",
                        data: _this_1.settingData.area_devices
                    }));
                };
                socket.onclose = function (event) {
                    _this_1.tip('关闭', EWsStatus.Error);
                    setTimeout(function () {
                        _this_1.dirty = true;
                        _this_1.connect();
                    }, _this_1.RECONNECT_INTERVAL);
                };
                socket.onmessage = function (msg) {
                    var received_msg;
                    try {
                        received_msg = JSON.parse(msg.data);
                    }
                    catch (error) {
                        console.log('json parse error', error);
                    }
                    if (received_msg) {
                        if (received_msg.name == 'push_devices') {
                            console.log('dev', received_msg.data);
                            var devlist = received_msg.data;
                            for (var i in devlist) {
                                var devdata = devlist[i];
                                if (!devdata)
                                    continue;
                                for (var bi_1 in devdata.beds) {
                                    var cachebi = devdata['device_no'] + '-' + devdata.beds[bi_1].bed_no;
                                    if (!datacache.has(cachebi)) {
                                        datacache.set(cachebi, getEmptyCacheItem());
                                        convertdocid(cachebi, devdata.beds[bi_1].doc_id);
                                        if (devdata.beds[bi_1].is_working == 0) {
                                            datacache.get(cachebi).status = Working;
                                        }
                                        else if (devdata.beds[bi_1].is_working == 1) {
                                            datacache.get(cachebi).status = Stopped;
                                        }
                                        else {
                                            datacache.get(cachebi).status = Offline;
                                        }
                                        if (devdata.beds[bi_1].pregnancy) {
                                            datacache.get(cachebi).pregnancy = devdata.beds[bi_1].pregnancy;
                                        }
                                        datacache.get(cachebi).fetal_num = devdata.beds[bi_1].fetal_num;
                                        for (var fetal = 0; fetal < devdata.beds[bi_1].fetal_num; fetal++) {
                                            datacache.get(cachebi).fhr[fetal] = [];
                                        }
                                    }
                                }
                            }
                            _this_1.tip('成功', EWsStatus.Success);
                            res(datacache);
                            _this_1.emit('read', datacache);
                            _this_1.isReady = true;
                        }
                        else if (received_msg.name == 'push_data_ctg') {
                            var ctgdata = received_msg.data;
                            var id = received_msg.device_no;
                            var bi = received_msg.bed_no;
                            var cachbi = id + '-' + bi;
                            if (datacache.has(cachbi)) {
                                var tmpcache = datacache.get(cachbi);
                                if (isNaN(tmpcache.csspan)) {
                                    tmpcache.csspan = _this_1.span;
                                }
                                for (var key in ctgdata) {
                                    for (var fetal = 0; fetal < tmpcache.fetal_num; fetal++) {
                                        if (ctgdata[key].fhr == 0) {
                                            continue;
                                        }
                                        if (fetal == 0) {
                                            tmpcache.fhr[fetal][ctgdata[key].index] = ctgdata[key].fhr;
                                        }
                                        else {
                                            tmpcache.fhr[fetal][ctgdata[key].index] = ctgdata[key].fhr2;
                                        }
                                    }
                                    tmpcache.toco[ctgdata[key].index] = ctgdata[key].toco;
                                    tmpcache.fm[ctgdata[key].index] = ctgdata[key].fm;
                                    if (tmpcache.start == -1) {
                                        tmpcache.start = ctgdata[key].index;
                                        tmpcache.past = ctgdata[key].index - 4800 > 0 ? ctgdata[key].index - 4800 : 0;
                                        tmpcache.last = tmpcache.start;
                                    }
                                    setcur(cachbi, ctgdata[key].index);
                                    for (var i_1 = datacache.get(cachbi).start; i_1 > datacache.get(cachbi).past; i_1--) {
                                        if (!tmpcache.fhr[0][i_1]) {
                                            var curstamp = new Date().getTime();
                                            if (_this_1.offrequest < 8 && (tmpcache.orflag || curstamp - tmpcache.timestamp > _this_1.interval)) {
                                                tmpcache.orflag = false;
                                                _this_1.offrequest += 1;
                                                var dis = tmpcache.start - tmpcache.past;
                                                var length = dis > 800 ? 800 : dis;
                                                var startpoint = tmpcache.start - length;
                                                var endpoint = tmpcache.start;
                                                _this_1.send('{"name":"get_data_ctg","data":{"start_index":' +
                                                    startpoint +
                                                    ',"end_index":' +
                                                    endpoint +
                                                    ',"device_no":' +
                                                    id +
                                                    ',"bed_no":' +
                                                    bi +
                                                    '}}');
                                                tmpcache.timestamp = new Date().getTime();
                                                break;
                                            }
                                        }
                                    }
                                    if (ctgdata[key].index - tmpcache.last < 2) {
                                        tmpcache.last = ctgdata[key].index;
                                    }
                                    else {
                                    }
                                }
                            }
                        }
                        else if (received_msg.name == 'get_data_ctg') {
                            var ctgdata = received_msg.data;
                            var id = received_msg.device_no;
                            var bi = received_msg.bed_no;
                            var cachbi = id + '-' + bi;
                            if (datacache.has(cachbi)) {
                                var tmpcache = datacache.get(cachbi);
                                for (var key in ctgdata) {
                                    for (var fetal = 0; fetal < tmpcache.fetal_num; fetal++) {
                                        if (fetal == 0) {
                                            tmpcache.fhr[fetal][ctgdata[key].index] = ctgdata[key].fhr;
                                        }
                                        else {
                                            tmpcache.fhr[fetal][ctgdata[key].index] = ctgdata[key].fhr2;
                                        }
                                    }
                                    tmpcache.toco[ctgdata[key].index] = ctgdata[key].toco;
                                    tmpcache.fm[ctgdata[key].index] = ctgdata[key].fm;
                                    setcur(cachbi, ctgdata[key].index);
                                }
                                tmpcache.orflag = true;
                                if (_this_1.offrequest > 0) {
                                    _this_1.offrequest -= 1;
                                }
                            }
                        }
                        else if (received_msg.name == 'get_devices') {
                        }
                        else if (received_msg.name == 'update_status') {
                            console.log('update_status', received_msg.data);
                            var statusdata = received_msg.data;
                            var id = statusdata.device_no;
                            var bi = statusdata.bed_no;
                            var cachbi = id + '-' + bi;
                            if (!datacache.has(cachbi)) {
                                datacache.set(cachbi, getEmptyCacheItem());
                            }
                            if (statusdata.status == 0) {
                                datacache.get(cachbi).status = Working;
                            }
                            else if (statusdata.status == 1) {
                                datacache.get(cachbi).status = Stopped;
                            }
                            else {
                                datacache.get(cachbi).status = Offline;
                            }
                            console.log('update_status', datacache.get(cachbi));
                            datacache.get(cachbi).pregnancy = statusdata.pregnancy;
                            _this_1.refresh('update_status');
                        }
                        else if (received_msg.name == 'push_data_ecg') {
                            var ecgdata = received_msg.data;
                            var id = received_msg.device_no;
                            var bi = received_msg.bed_no;
                            var cachbi = id + '-' + bi;
                            if (datacache.has(cachbi)) {
                                for (var eindex = 0; eindex < ecgdata.length; eindex++) {
                                    for (var elop = 0; elop < ecgdata[eindex].ecg_arr.length; elop++) {
                                        datacache.get(cachbi).ecg.EnQueue(ecgdata[eindex].ecg_arr[elop] & 0x7f);
                                    }
                                    datacache.get(cachbi).ecgdata = [ecgdata[eindex].pulse_rate, ecgdata[eindex].blood_oxygen, ecgdata[eindex].temperature, ecgdata[eindex].temperature1, ecgdata[eindex].pulse_rate, ecgdata[eindex].resp_rate, ecgdata[eindex].sys_bp + '/' + ecgdata[eindex].dia_bp + '/' + ecgdata[eindex].mean_bp];
                                }
                            }
                            else {
                                console.log('cache error', datacache);
                            }
                        }
                        else if (received_msg.name == 'start_work') {
                            var devdata_1 = received_msg.data;
                            var bed_no = devdata_1.bed_no, device_no = devdata_1.device_no;
                            var curid = device_no + "-" + bed_no;
                            cleardata(curid, devdata_1.fetal_num);
                            convertdocid(curid, devdata_1.doc_id);
                            _this_1.log('start_work', devdata_1, devdata_1.is_working);
                            var target = datacache.get(curid);
                            if (devdata_1.is_working == 0) {
                                target.status = Working;
                            }
                            else {
                                target.status = Stopped;
                            }
                            _this_1.refresh('start_work');
                        }
                        else if (received_msg.name == 'end_work') {
                            var devdata_2 = received_msg.data;
                            var curid = Number(devdata_2['device_no']) + '-' + Number(devdata_2['bed_no']);
                            if (datacache.get(curid).pregnancy == '') {
                                console.log('end_work', datacache.get(curid));
                                cleardata(curid, datacache.get(curid).fetal_num);
                                console.log('end_work', datacache.get(curid));
                            }
                            if (devdata_2.is_working == 0) {
                                datacache.get(curid).status = Working;
                            }
                            else {
                                datacache.get(curid).status = Stopped;
                            }
                            _this_1.refresh('end_work');
                        }
                        else if (received_msg.name == 'heard') {
                            var devdata_3 = received_msg.data;
                            console.log(devdata_3);
                            var servertime = convertstarttime(devdata_3.time);
                            _this_1.span = Math.floor(new Date(servertime).getTime() / 1000 - new Date().getTime() / 1000) * 4 - 12;
                            console.log(_this_1.span);
                        }
                    }
                };
                return [datacache];
            });
            function cleardata(curid, fetal_num) {
                if (datacache.has(curid)) {
                    datacache.get(curid).fhr = [];
                    datacache.get(curid).toco = [];
                    datacache.get(curid).fm = [];
                    datacache.get(curid).index = 0;
                    datacache.get(curid).length = 0;
                    datacache.get(curid).start = -1;
                    datacache.get(curid).last = 0;
                    datacache.get(curid).past = 0;
                    datacache.get(curid).timestamp = 0;
                    datacache.get(curid).docid = '';
                    datacache.get(curid).status = Offline;
                    datacache.get(curid).starttime = '';
                    datacache.get(curid).pregnancy = '';
                    datacache.get(curid).ecg = new Queue_1.default();
                    datacache.get(curid).ecgdata = [];
                }
                else {
                    datacache.set(curid, getEmptyCacheItem());
                }
                datacache.get(curid).fetal_num = fetal_num;
                for (var fetal = 0; fetal < fetal_num; fetal++) {
                    datacache.get(curid).fhr[fetal] = [];
                }
            }
            function convertdocid(id, doc_id) {
                datacache.get(id).docid = doc_id;
                if (doc_id != '') {
                    var vt = doc_id.split('_');
                    if (vt.length > 2) {
                        datacache.get(id).starttime = convertstarttime(vt[2]);
                    }
                }
            }
            function convertstarttime(pureid) {
                return '20' +
                    pureid.substring(0, 2) +
                    '-' +
                    pureid.substring(2, 4) +
                    '-' +
                    pureid.substring(4, 6) +
                    ' ' +
                    pureid.substring(6, 8) +
                    ':' +
                    pureid.substring(8, 10) +
                    ':' +
                    pureid.substring(10, 12);
            }
            function setcur(id, value) {
                if (value < datacache.get(id).start) {
                    datacache.get(id).start = value;
                }
                else if (value >= datacache.get(id).index) {
                    datacache.get(id).index = value;
                    var arr = id.split('-');
                    var text = id;
                    arr[0] && arr[1] && arr[0] === arr[1] && (text = arr[0]);
                    if (value > 20 * 240) {
                        announce(text);
                    }
                }
            }
            function starttask(queue, offstart) {
                if (!queue.IsEmpty()) {
                    offstart = true;
                    var obj = queue.DeQueue();
                    getoffline(queue, obj.docid, obj.length, offstart);
                }
                else {
                    offstart = false;
                }
            }
            function getoffline(queue, doc_id, offlineend, offstart) {
                request_1.default.get("/ctg-exams-data/" + doc_id).then(function (responseData) {
                    var vt = doc_id.split('_');
                    var dbid = vt[0] + '-' + vt[1];
                    console.log(doc_id, offlineend, responseData, datacache.get(dbid).past);
                    if (responseData) {
                        initfhrdata(responseData, datacache.get(dbid), offlineend, queue, offstart);
                    }
                });
            }
            function initfhrdata(data, datacache, offindex, queue, offstart) {
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
                starttask(queue, offstart);
            }
        };
        var datacache = _this_1.datacache;
        datacache.clean = function (key) {
            var target = datacache.get(key);
            datacache.set(key, Object.assign(target, getEmptyCacheItem()));
        };
        settingData = settingData || {
            ws_url: "192.168.0.227:8084",
            xhr_url: "192.168.2.152:9986",
            alarm_high: "160",
            alarm_low: "110",
            alarm_on_window: "1",
            alarm_on_sound: "1"
        };
        if (WsService._this) {
            return WsService._this;
        }
        WsService._this = _this_1;
        _this_1.settingData = settingData;
        return _this_1;
    }
    WsService.prototype.refresh = function (name) {
        var _this_1 = this;
        if (this.refreshTimeout) {
            this.log(name, 'refresh', 'discarded');
            return;
        }
        this.refreshTimeout = setTimeout(function () {
            _this_1.log(name, 'refresh');
            _this_1.dispatch({
                type: 'ws/updateData', payload: { data: new Map(_this_1.datacache) }
            });
            _this_1.refreshTimeout = null;
        }, this.refreshInterval);
    };
    WsService.prototype.getDatacache = function () {
        var _this_1 = this;
        if (this.isReady) {
            return Promise.resolve(this.datacache);
        }
        else {
            return new Promise(function (resolve) {
                _this_1.once('read', function (data) {
                    resolve(data);
                });
            });
        }
    };
    WsService.prototype.send = function (message) {
        var _a = this, log = _a.log, socket = _a.socket;
        if (socket.readyState == WebSocket.OPEN) {
            socket.send(message);
        }
        else {
            log('The socket is not open.');
        }
    };
    WsService.prototype.startwork = function (device_no, bed_no) {
        var message = "{\"name\":\"start_work\",\"data\":{\"device_no\":" + device_no + ",\"bed_no\":" + bed_no + "}}";
        this.send(message);
    };
    WsService.prototype.endwork = function (device_no, bed_no) {
        var message = "{\"name\":\"end_work\",\"data\":{\"device_no\":" + device_no + ",\"bed_no\":" + bed_no + "}}";
        this.send(message);
    };
    WsService.prototype.dispatch = function (action) {
        window.g_app._store.dispatch(action);
    };
    WsService.prototype._emit = function (name) {
        var value = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            value[_i - 1] = arguments[_i];
        }
        utils_1.event.emit.apply(utils_1.event, __spreadArrays(["WsService:" + name], value));
    };
    WsService.wsStatus = EWsStatus;
    return WsService;
}(utils_1.EventEmitter));
exports.WsService = WsService;
var announce = lodash_1.throttle(function (text) {
    sp(text) && utils_1.event.emit('bed:announcer', text + "\u53F7\u5B50\u673A\u76D1\u62A4\u65F6\u95F4\u5230");
}, ANNOUNCE_INTERVAL);
var timeoutKey = null;
var spObj = {};
function sp(key) {
    if (!timeoutKey) {
        timeoutKey = setTimeout(function () {
            spObj = {};
            timeoutKey = null;
        }, 1000 * 60 * 20);
    }
    var old = spObj[key];
    return old ? false : (spObj[key] = true);
}
