"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const Booking_1 = require("../../../shared/types/Booking");
const schema = new mongoose_1.Schema({
    owner: { type: String, required: true },
    id: { type: String, required: true },
    status: { type: String, required: true, default: Booking_1.BookingStatus.PENDING },
    driver: {
        type: String,
        required: false,
    },
    width: { type: Number, required: true },
    length: { type: Number, required: true },
    height: { type: Number, required: false, default: 0 },
    weight: { type: Number, required: true },
    specialPackaging: [{ type: String }],
    pickUp: {
        name: { type: String, required: true },
        contactNumber: { type: String, required: true },
        address: { type: String, required: true },
        notes: { type: String, required: false, default: "" },
        lat: { type: Number, required: true, default: 14.5799875 },
        lng: { type: Number, required: true, default: 120.9758997 },
    },
    dropOut: {
        name: { type: String, required: true },
        contactNumber: { type: String, required: true },
        address: { type: String, required: true },
        notes: { type: String, required: false, default: "" },
        lat: { type: Number, required: true, default: 14.5799875 },
        lng: { type: Number, required: true, default: 120.9758997 },
    },
    paymentMethod: {
        type: String,
        required: true,
        default: Booking_1.BookingPaymentMethod.COD,
    },
    tip: { type: Number, required: false, default: 0 },
    deliveryFee: { type: Number, required: true, default: 0 },
    totalFee: { type: Number, required: true, default: 0 },
}, { timestamps: true });
exports.BookingModel = mongoose_1.default.models.booking ||
    (0, mongoose_1.model)("booking", schema);
