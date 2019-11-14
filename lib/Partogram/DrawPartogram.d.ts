declare type Canvas = HTMLCanvasElement;
declare type Ctx = CanvasRenderingContext2D;
interface I {
    canvas: Canvas;
    canvas2: Canvas;
    width: number;
    height: number;
}
export declare class DrawPartogram {
    canvas: Canvas;
    context: Ctx;
    canvas2: Canvas;
    context2: Ctx;
    width: number;
    height: number;
    maxindex: number;
    lastx: number;
    lasty: number;
    baseleft: number;
    basetop: number;
    type: number;
    isshowevent: number;
    max: number;
    start: string;
    demodata: {
        checktime: string;
        cd: string;
        df: string;
        event: string;
    }[];
    lastcurrx: number;
    currentx: number;
    constructor(args: I);
    showcur(x: any, fhr: any, toco: any): void;
    selectfrom(lowValue: any, highValue: any): number;
    setrules(x: any, align: any): boolean;
    drawarc(x: any, y: any): void;
    drawcross(x: any, y: any): void;
    showevent(x: any, y: any, data: any): void;
    setrrules(x: any, align: any): boolean;
    sethrules(): boolean;
    setvertical(maxline: any): boolean;
    sethorizontal(length: number): boolean;
    converttime(start: any, current: any): string;
    drawgrid(): void;
    printline(): void;
    setting(showtype: any): void;
    getEventPosition(ev: any): string;
    formatDate(date: any, format: any): any;
}
export {};
