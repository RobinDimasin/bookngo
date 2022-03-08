"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
class Logger {
    constructor(tag) {
        this.tag = tag;
    }
    log(log) {
        Logger.printer(`[${this.tag}] ${log}`);
    }
    static setPrinter(printer) {
        Logger.printer = printer;
    }
    static new(tag) {
        return new Logger(tag);
    }
}
exports.Logger = Logger;
Logger.printer = console.log;
