import mongoose, { Schema, model } from "mongoose";
import { Feedback } from "../../../shared/types/Feedback";

const feedbackSchema = new Schema<Feedback>({
  to: { type: String, required: true },
  from: { type: String, required: true },
  message: { type: String, required: true },
  rating: { type: Number, required: true },
  timestamp: { type: Number, required: true },
});

export const FeedbackModel =
  (mongoose.models.feedback as mongoose.Model<Feedback>) ||
  model<Feedback>("feedback", feedbackSchema);
