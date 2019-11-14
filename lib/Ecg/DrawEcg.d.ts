/// <reference types="node" />
import Draw from "../Draw";
import Queue from "./Queue";
declare type Canvas = HTMLCanvasElement;
declare type Ctx = CanvasRenderingContext2D;
interface I {
    wrap: HTMLDivElement;
    MultiParam: number[];
    Ple: number[];
    Tre: number[];
    canvas: Canvas;
    canvasline: Canvas;
    canvasmonitor: Canvas;
    ecg_scope?: number;
    current_times?: number;
    max_times?: number;
    width?: number;
    height?: number;
    data: any;
}
declare enum displayMode {
    canvas = 0,
    text = 1
}
export declare class DrawEcg extends Draw {
    mode: displayMode;
    static Queue: typeof Queue;
    wrap: HTMLDivElement;
    oQueue: Queue;
    values: (string | number)[];
    MultiParam: number[];
    Ple: number[];
    Tre: number[];
    canvas: Canvas;
    canvasline: Canvas;
    canvasmonitor: Canvas;
    ctx: Ctx;
    linectx: Ctx;
    datactx: Ctx;
    ecg_scope?: number;
    current_times?: number;
    max_times?: number;
    current_time_millis?: number;
    start?: number;
    intervalIds: NodeJS.Timeout[];
    last_points: number[];
    constructor(args: I);
    init(data: any): void;
    _resize(): void;
    destroy(): void;
    ecg(): void;
    Convert16Scale(): void;
    addfilltext(): void;
    DrawDatatext(): void;
    adddata(F: any, C: any, E: any, J: any): void;
    initparm(): void;
    timerEcg(dely: any): void;
    drawsingle(): void;
    clearcanvans(B: any, F: any, C: any, D: any): void;
    GetYStarts(C: any): any[];
}
export {};
