import { EventEmitter } from "@lianmed/utils";
import { Drawer } from "./interface";
export default class Draw extends EventEmitter implements Drawer {
    sid: number;
    width: number;
    height: number;
    wrap: HTMLElement;
    constructor();
    log: any;
    destroy(): void;
    init(data: any): void;
    resize(): void;
    _resize(): void;
}
