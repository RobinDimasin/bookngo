import { NextApiRequest, NextApiResponse } from "next";
import { Booking } from "../../../server/booking";
import { BookingStatus } from "../../../shared/types/Booking";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  return res.status(200).json({
    count: (await Booking.find(BookingStatus.COMPLETED)).bookings.length,
  });
}
