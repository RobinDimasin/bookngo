"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeedbackManager = void 0;
const database_1 = require("../database");
class FeedbackManager {
    static async new(to, from, message, rating) {
        const FeedbackModel = database_1.Database.getModel("feedback");
        const feedback = await FeedbackModel.create({
            to,
            from,
            message,
            rating,
            timestamp: new Date().getTime(),
        });
        return feedback.toJSON();
    }
    static async getTo(key) {
        const FeedbackModel = database_1.Database.getModel("feedback");
        return (await FeedbackModel.find({ to: key })).map((feedback) => feedback.toJSON());
    }
    static async getFrom(key) {
        const FeedbackModel = database_1.Database.getModel("feedback");
        return (await FeedbackModel.find({ from: key })).map((feedback) => feedback.toJSON());
    }
}
exports.FeedbackManager = FeedbackManager;
