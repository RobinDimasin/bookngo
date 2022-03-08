import mongoose, { Schema, model } from "mongoose";
import {
  BookingDetailsExtendend,
  BookingPaymentMethod,
  BookingStatus,
} from "../../../shared/types/Booking";

const schema = new Schema<BookingDetailsExtendend>(
  {
    owner: { type: String, required: true },
    id: { type: String, required: true },
    status: { type: String, required: true, default: BookingStatus.PENDING },

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
      default: BookingPaymentMethod.COD,
    },
    tip: { type: Number, required: false, default: 0 },
    deliveryFee: { type: Number, required: true, default: 0 },
    totalFee: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

export const BookingModel =
  (mongoose.models.booking as mongoose.Model<BookingDetailsExtendend>) ||
  model<BookingDetailsExtendend>("booking", schema);
