"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Status = exports.StatusCode = void 0;
var StatusCode;
(function (StatusCode) {
    StatusCode["EMAIL_TAKEN"] = "EMAIL_TAKEN";
    StatusCode["ACCOUNT_DOES_NOT_EXISTS"] = "ACCOUNT_DOES_NOT_EXISTS";
    StatusCode["ACCOUNT_EXISTS"] = "ACCOUNT_EXISTS";
    StatusCode["INCORRECT_PASSWORD"] = "INCORRECT_PASSWORD";
    StatusCode["CORRECT_PASSWORD"] = "CORRECT_PASSWORD";
    StatusCode["ACCOUNT_SUCCESSFULLY_CREATED"] = "ACCOUNT_SUCCESSFULLY_CREATED";
    StatusCode["VALID_TOKEN"] = "VALID_TOKEN";
    StatusCode["INVALID_TOKEN"] = "INVALID_TOKEN";
    StatusCode["NOT_LOGGED_IN"] = "NOT_LOGGED_IN";
    StatusCode["ALREADY_LOGGED_IN"] = "ALREADY_LOGGED_IN";
    StatusCode["NONCE_TOO_LOW"] = "NONCE_TOO_LOW";
    StatusCode["NO_ACCESS"] = "NO_ACCESS";
    StatusCode["BOOKING_FOUND"] = "BOOKING_FOUND";
    StatusCode["BOOKING_NOT_FOUND"] = "BOOKING_NOT_FOUND";
    StatusCode["BOOKING_SUCCESSFULLY_ASSIGNED"] = "BOOKING_SUCCESSFULLY_ASSINED";
    StatusCode["BOOKING_ALREADY_ASSIGNED"] = "BOOKING_ALREADY_ASSIGNED";
    StatusCode["BOOKING_STATUS_CHANGED"] = "BOOKING_STATUS_CHANGED";
})(StatusCode = exports.StatusCode || (exports.StatusCode = {}));
class Status {
    constructor() {
        this.codes = new Set();
    }
    add(code) {
        this.codes.add(code);
    }
    delete(code) {
        this.codes.delete(code);
    }
    has(code) {
        return this.codes.has(code);
    }
    get() {
        return Array.from(this.codes.values());
    }
}
exports.Status = Status;
