import type { NextApiRequest, NextApiResponse } from "next";
import { AccountManager } from "../../../../server/account";
import { Booking } from "../../../../server/booking";
import { StatusCode } from "../../../../shared/status";
import { AccountTypes } from "../../../../shared/types/AccountTypes";
import {
  BookingDetailsExtendend,
  BookingStatus,
} from "../../../../shared/types/Booking";

type Data = {
  bookings: BookingDetailsExtendend[];
  status: Array<StatusCode>;
};

async function handler(req: NextApiRequest & {}, res: NextApiResponse<Data>) {
  let { key, status = [] } = req.query;

  if (typeof status === "string") {
    status = [status];
  }

  if (typeof key === "string" && Array.isArray(status)) {
    const { bookings, status: s } = await Booking.fromOwner(
      key,
      status as BookingStatus[]
    );

    res.status(200).json({ bookings, status: s.get() });
  } else {
    res.status(500);
  }
}

export default handler;
