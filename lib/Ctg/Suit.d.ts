/// <reference types="node" />
/// <reference types="lodash" />
import DrawCTG from './DrawCTG';
import { IBarTool } from '../ScrollBar/useScroll';
import ScrollEl from '../ScrollBar/ScrollEl';
import { ICacheItem } from '../services/WsService';
import Draw from '../Draw';
declare type Canvas = HTMLCanvasElement;
declare type Context = CanvasRenderingContext2D;
export declare class Suit extends Draw {
    emitInterval: number;
    static option: {
        [x: string]: string;
    };
    option: {
        [x: string]: string;
    };
    initFlag: boolean;
    sid: number;
    log: any;
    startingBar: ScrollEl;
    endingBar: ScrollEl;
    intervalIds: NodeJS.Timeout[];
    data: any;
    starttime: string;
    fetalcount: number;
    type: number;
    currentdot: number;
    currentx: number;
    viewposition: number;
    scollscale: number;
    buffersize: number;
    curr: number;
    ctgconfig: {
        normalarea: string;
        selectarea: string;
        rule: string;
        scale: string;
        primarygrid: string;
        secondarygrid: string;
        fhrcolor: string[];
        tococolor: string;
        alarmcolor: string;
        alarm_enable: boolean;
        alarm_high: number;
        alarm_low: number;
    };
    fetalposition: {
        fhr1: string;
        fhr2: string;
        fhr3: string;
    };
    printlen: number;
    selectstart: number;
    selectrpstart: number;
    selectend: number;
    selectrpend: number;
    selectflag: boolean;
    requestflag: boolean;
    canvasgrid: Canvas;
    contextgrid: Context;
    canvasdata: Canvas;
    contextdata: Context;
    canvasline: Canvas;
    contextline: Context;
    canvasselect: Canvas;
    contextselect: Context;
    canvasanalyse: Canvas;
    contextanalyse: Context;
    drawobj: DrawCTG;
    barTool: IBarTool;
    dragtimestamp: number;
    interval: number;
    timeout: NodeJS.Timeout;
    constructor(canvasgrid: Canvas, canvasdata: Canvas, canvasline: Canvas, canvasselect: Canvas, canvasanalyse: Canvas, wrap: HTMLElement, barTool: IBarTool, type: number);
    init(data: ICacheItem): void;
    lazyEmit: ((type: string, ...args: any[]) => boolean) & import("lodash").Cancelable;
    alarmOn(alarmType?: string): void;
    alarmOff(alarmType: string): void;
    createBar(): void;
    lockStartingBar(status: boolean): void;
    destroy(): void;
    resize(): void;
    setfetalposition(fhr1: any, fhr2: any, fhr3: any): void;
    movescoller(): void;
    InitFileData(oriobj: any): {
        fhr: any[][];
        toco: any[];
        fm: any[];
        fetal_num: number;
        index: number;
        starttime: string;
        analyse: {
            acc: any[];
            dec: any[];
            baseline: any[];
            start: number;
            end: number;
        };
    };
    drawdot(): void;
    timerCtg(dely: any): void;
    onStatusChange(status: boolean): boolean | void;
    getoffline(doc_id: string, offlineend: number): void;
    initfhrdata(data: any, datacache: any, offindex: any): void;
}
export {};
