"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Queue = (function () {
    function Queue() {
        this.B = [];
        this.capacity = 2048;
    }
    Queue.prototype.EnQueue = function (C) {
        if (C == null) {
            return -1;
        }
        if (this.B.length >= this.capacity) {
            this.B.shift();
        }
        this.B.push(C);
    };
    Queue.prototype.DeQueue = function () {
        if (this.B.length == 0) {
            return null;
        }
        else {
            return this.B.shift();
        }
    };
    Queue.prototype.GetSize = function () {
        return this.B.length;
    };
    Queue.prototype.GetHead = function () {
        if (this.B.length == 0) {
            return null;
        }
        else {
            return this.B[0];
        }
    };
    Queue.prototype.MakeEmpty = function () {
        this.B.length = 0;
    };
    Queue.prototype.IsEmpty = function () {
        if (this.B.length == 0) {
            return true;
        }
        else {
            return false;
        }
    };
    return Queue;
}());
exports.default = Queue;
