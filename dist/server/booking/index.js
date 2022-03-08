"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Booking = exports.BookingQueue = void 0;
const Booking_1 = require("../../shared/types/Booking");
const database_1 = require("../database");
const dotenv_1 = __importDefault(require("dotenv"));
const status_1 = require("../../shared/status");
const uuid_1 = require("uuid");
const account_1 = require("../account");
dotenv_1.default.config();
class Queue {
    constructor() {
        this.items = {};
        this.head = 0;
        this.tail = 0;
    }
    enqueue(item) {
        this.items[this.tail] = item;
        this.tail++;
    }
    dequeue() {
        const item = this.items[this.head];
        delete this.items[this.head];
        this.head++;
        return item;
    }
    peek() {
        return this.items[this.head];
    }
    get length() {
        return this.tail - this.head;
    }
}
class BookingQueue extends Queue {
    constructor() {
        super(...arguments);
        this.isRunning = false;
    }
    enqueue(item) {
        super.enqueue(item);
        this.run();
    }
    async run() {
        if (!this.isRunning) {
            this.isRunning = true;
            while (this.length > 0) {
                const item = this.dequeue();
                await item();
            }
            this.isRunning = false;
        }
    }
}
exports.BookingQueue = BookingQueue;
class Booking {
    static new(details, token) {
        return new Promise(async (resolve) => {
            const BookingModel = database_1.Database.getModel("booking");
            const status = new status_1.Status();
            const id = (0, uuid_1.v4)();
            const { payload, status: validationStatus } = account_1.PersonalAccount.validateToken(token);
            validationStatus.get().forEach((s) => status.add(s));
            if (payload.key) {
                if (!Booking.queues.has(payload.key)) {
                    Booking.queues.set(payload.key, new BookingQueue());
                }
                const { account, status: accountStatus } = await account_1.PersonalAccount.getDetails(payload.key);
                accountStatus.get().forEach((s) => status.add(s));
                if (account === null) {
                    status.add(status_1.StatusCode.ACCOUNT_DOES_NOT_EXISTS);
                    resolve({
                        id: null,
                        status,
                    });
                }
                else {
                    const initialNonce = account.nonce;
                    Booking.queues.get(account.key).enqueue(async () => {
                        var _a, _b;
                        const accountDetails = await account_1.PersonalAccount.getDetails(payload.key);
                        const nonce = (_a = accountDetails.account) === null || _a === void 0 ? void 0 : _a.nonce;
                        if (initialNonce !== nonce) {
                            status.add(status_1.StatusCode.NONCE_TOO_LOW);
                            resolve({
                                id: null,
                                status,
                            });
                        }
                        const bookingDetails = await new BookingModel(Object.assign(Object.assign({}, details), { owner: account.key, id, totalFee: details.deliveryFee + ((_b = details.tip) !== null && _b !== void 0 ? _b : 0) })).save();
                        await account_1.PersonalAccount.Model.updateOne({ key: account.key }, { $inc: { nonce: 1 } });
                        resolve({
                            id: bookingDetails.id,
                            status,
                        });
                    });
                }
            }
            else {
                status.add(status_1.StatusCode.ACCOUNT_DOES_NOT_EXISTS);
                resolve({
                    id: null,
                    status,
                });
            }
        });
    }
    static async assign(key, id) {
        const status = new status_1.Status();
        const { booking, status: s } = await Booking.get(id);
        if (s.has(status_1.StatusCode.BOOKING_FOUND)) {
            if (!booking.driver) {
                const BookingModel = database_1.Database.getModel("booking");
                await BookingModel.updateOne({ id }, { driver: key, status: Booking_1.BookingStatus.TO_PICK_UP });
                status.add(status_1.StatusCode.BOOKING_SUCCESSFULLY_ASSIGNED);
            }
            else {
                status.add(status_1.StatusCode.BOOKING_ALREADY_ASSIGNED);
            }
        }
        else {
            status.add(status_1.StatusCode.BOOKING_NOT_FOUND);
        }
        return {
            status,
        };
    }
    static async changeStatus(id, newStatus) {
        const status = new status_1.Status();
        const { status: s } = await Booking.get(id);
        if (s.has(status_1.StatusCode.BOOKING_FOUND)) {
            const BookingModel = database_1.Database.getModel("booking");
            await BookingModel.updateOne({ id }, { status: newStatus });
            status.add(status_1.StatusCode.BOOKING_STATUS_CHANGED);
        }
        else {
            status.add(status_1.StatusCode.BOOKING_NOT_FOUND);
        }
        return {
            status,
        };
    }
    static async fromOwner(key, bookingStatus = []) {
        const status = new status_1.Status();
        let bookingsFound = [];
        if (await account_1.PersonalAccount.isRegistered(key)) {
            const BookingModel = database_1.Database.getModel("booking");
            const bookings = await BookingModel.find({ owner: key });
            bookingsFound = bookings
                .filter((booking) => bookingStatus.length === 0
                ? true
                : bookingStatus.includes(booking.status))
                .map((booking) => booking.toJSON());
        }
        else {
            status.add(status_1.StatusCode.ACCOUNT_DOES_NOT_EXISTS);
        }
        return {
            bookings: bookingsFound,
            status,
        };
    }
    static async fromDriver(key, bookingStatus = []) {
        const status = new status_1.Status();
        let bookingsFound = [];
        if (await account_1.DriverAccount.isRegistered(key)) {
            const BookingModel = database_1.Database.getModel("booking");
            const bookings = await BookingModel.find({ driver: key });
            bookingsFound = bookings
                .filter((booking) => bookingStatus.length === 0
                ? true
                : bookingStatus.includes(booking.status))
                .map((booking) => booking.toJSON());
        }
        else {
            status.add(status_1.StatusCode.ACCOUNT_DOES_NOT_EXISTS);
        }
        return {
            bookings: bookingsFound,
            status,
        };
    }
    static async find(...bookingStatus) {
        const status = new status_1.Status();
        const BookingModel = database_1.Database.getModel("booking");
        const bookings = await BookingModel.find();
        const bookingsFound = bookings
            .filter((booking) => bookingStatus.length === 0
            ? true
            : bookingStatus.includes(booking.status))
            .map((booking) => booking.toJSON());
        return {
            bookings: bookingsFound,
            status,
        };
    }
    static async get(id) {
        const status = new status_1.Status();
        const booking = (await database_1.Database.getModel("booking").findOne({
            id,
        }));
        if (booking) {
            status.add(status_1.StatusCode.BOOKING_FOUND);
        }
        else {
            status.add(status_1.StatusCode.BOOKING_NOT_FOUND);
        }
        return {
            booking,
            status,
        };
    }
}
exports.Booking = Booking;
Booking.queues = new Map();
