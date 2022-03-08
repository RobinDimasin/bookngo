"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Database = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const Logger_1 = require("../../shared/Logger");
const BookingModel_1 = require("./models/BookingModel");
const FeedbackModel_1 = require("./models/FeedbackModel");
dotenv_1.default.config();
class Database {
    static async init() {
        const URI = process.env.MONGODB_URI;
        if (URI !== undefined) {
            Database._db = await mongoose_1.default.connect(URI);
            Database.logger.log("Connected.");
        }
        else {
            Database.logger.log("MONGODB_URI not found.");
        }
    }
    static get db() {
        return Database._db;
    }
    static getModel(name) {
        return Database.models[name];
    }
}
exports.Database = Database;
Database.models = {
    booking: BookingModel_1.BookingModel,
    feedback: FeedbackModel_1.FeedbackModel,
};
Database.logger = Logger_1.Logger.new("Database");
