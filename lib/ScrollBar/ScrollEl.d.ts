import { EventEmitter } from "@lianmed/utils";
export default class ScrollEl extends EventEmitter {
    wrapper: HTMLElement;
    el: HTMLElement;
    constructor(wrapper: HTMLElement);
    setStyle(key: string, value: string | number): this;
    setStyles(styles: {
        [x: string]: string | number;
    }): this;
    toggleVisibility(): void;
    setVisibility(isHidden: any): void;
    addEventListener<k extends keyof HTMLElementEventMap>(key: k, cb: (e: HTMLElementEventMap[k]) => void): this;
    moveCb: (e: any) => void;
    setOffset(offset: number, isfire?: boolean): void;
    getCoordInDocument(e: MouseEvent): {
        x: number;
        y: number;
    };
}
