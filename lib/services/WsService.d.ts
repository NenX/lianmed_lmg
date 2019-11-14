import { EventEmitter } from "@lianmed/utils";
import Queue from "../Ecg/Queue";
export declare enum EWsStatus {
    Pendding = 0,
    Success = 1,
    Error = 2
}
export declare enum BedStatus {
    Working = 1,
    Stopped = 2,
    Offline = 3
}
export declare class WsService extends EventEmitter {
    static wsStatus: typeof EWsStatus;
    isReady: boolean;
    dirty: boolean;
    interval: number;
    RECONNECT_INTERVAL: number;
    span: number;
    offQueue: Queue;
    offstart: boolean;
    static _this: WsService;
    log: any;
    datacache: ICache;
    settingData: {
        [x: string]: string;
    };
    socket: WebSocket;
    offrequest: number;
    constructor(settingData?: any);
    refreshInterval: number;
    refreshTimeout: any;
    refresh(name: any): void;
    getDatacache(): Promise<ICache>;
    send(message: string): void;
    startwork(device_no: number, bed_no: number): void;
    endwork(device_no: number, bed_no: number): void;
    dispatch(action: any): void;
    _emit(name: string, ...value: any[]): void;
    tip: (text: string, status: EWsStatus) => void;
    connect: () => Promise<ICache>;
}
export interface ICacheItem {
    fhr: number[][];
    toco: number[];
    fm: number[];
    index: number;
    length: number;
    start: number;
    last: number;
    past: number;
    timestamp: number;
    docid: string;
    pregnancy: string;
    status: BedStatus;
    orflag: boolean;
    starttime: string;
    fetal_num: number;
    csspan: number;
    ecg: Queue;
    ecgdata: number[];
}
export declare type ICache = Map<string, ICacheItem> & {
    clean?: (key: string) => void;
};
export interface IDevice {
    ERP: string;
    bed_num: number;
    beds: IBed[];
    device_no: number;
    device_type: string;
    ecg_sampling_rate: number;
    is_handshake_finish: boolean;
    wifi_conn_state: boolean;
}
export interface IBed {
    bed_no: number;
    doc_id: string;
    fetal_num: number;
    is_include_mother: boolean;
    is_working: number;
    pregnancy: string;
}
