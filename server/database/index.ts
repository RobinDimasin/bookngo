import mongoose from "mongoose";
import dotenv from "dotenv";
import { Logger } from "../../shared/Logger";
import { BookingModel } from "./models/BookingModel";
import { FeedbackModel } from "./models/FeedbackModel";
dotenv.config();

export class Database {
  static readonly models = {
    booking: BookingModel,
    feedback: FeedbackModel,
  } as const;
  static readonly logger: Logger = Logger.new("Database");
  private static _db: typeof mongoose;

  static async init() {
    const URI = process.env.MONGODB_URI;

    if (URI !== undefined) {
      Database._db = await mongoose.connect(URI);
      Database.logger.log("Connected.");
    } else {
      Database.logger.log("MONGODB_URI not found.");
    }
  }

  static get db() {
    return Database._db;
  }

  static getModel<T extends keyof typeof Database.models>(name: T) {
    return Database.models[name];
  }
}
