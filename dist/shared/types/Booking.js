"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingPaymentMethod = exports.BookingStatus = exports.BookingSpecialPackaging = void 0;
var BookingSpecialPackaging;
(function (BookingSpecialPackaging) {
    BookingSpecialPackaging["NONE"] = "none";
    BookingSpecialPackaging["FRAGILE"] = "fragile";
    BookingSpecialPackaging["HEAVY"] = "heavy";
    BookingSpecialPackaging["IRREGULAR_SHAPE"] = "irregular_shape";
    BookingSpecialPackaging["LIQUIDS"] = "liquids";
})(BookingSpecialPackaging = exports.BookingSpecialPackaging || (exports.BookingSpecialPackaging = {}));
var BookingStatus;
(function (BookingStatus) {
    BookingStatus["PENDING"] = "PENDING";
    BookingStatus["TO_PICK_UP"] = "TO_PICK_UP";
    BookingStatus["TO_DROP_OFF"] = "TO_DROP_OFF";
    BookingStatus["COMPLETED"] = "COMPLETED";
    BookingStatus["FAILED"] = "FAILED";
    BookingStatus["CANCELLED"] = "CANCELLED";
})(BookingStatus = exports.BookingStatus || (exports.BookingStatus = {}));
var BookingPaymentMethod;
(function (BookingPaymentMethod) {
    BookingPaymentMethod["COD"] = "COD";
    BookingPaymentMethod["GCASH"] = "GCASH";
})(BookingPaymentMethod = exports.BookingPaymentMethod || (exports.BookingPaymentMethod = {}));
