import { Feedback } from "../../shared/types/Feedback";
import { Database } from "../database";

export class FeedbackManager {
  static async new(to: string, from: string, message: string, rating: number) {
    const FeedbackModel = Database.getModel("feedback");
    const feedback = await FeedbackModel.create({
      to,
      from,
      message,
      rating,
      timestamp: new Date().getTime(),
    });
    return feedback.toJSON() as Feedback;
  }

  static async getTo(key: string) {
    const FeedbackModel = Database.getModel("feedback");
    return (await FeedbackModel.find({ to: key })).map((feedback) =>
      feedback.toJSON()
    ) as Feedback[];
  }

  static async getFrom(key: string) {
    const FeedbackModel = Database.getModel("feedback");
    return (await FeedbackModel.find({ from: key })).map((feedback) =>
      feedback.toJSON()
    ) as Feedback[];
  }
}
