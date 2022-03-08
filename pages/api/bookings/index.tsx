import type { NextApiRequest, NextApiResponse } from "next";
import withAuth from "../../../middleware/api/withAuth";
import { AccountManager, PersonalAccount } from "../../../server/account";
import { Booking } from "../../../server/booking";
import { StatusCode } from "../../../shared/status";
import { AccountTypes } from "../../../shared/types/AccountTypes";
import {
  BookingDetailsExtendend,
  BookingStatus,
} from "../../../shared/types/Booking";

type Data = {
  bookings: BookingDetailsExtendend[];
  status: Array<StatusCode>;
};

async function handler(req: NextApiRequest & {}, res: NextApiResponse<Data>) {
  let { status = [] } = req.query;

  if (typeof status === "string") {
    status = [status];
  }

  const token = req.cookies.accessToken;

  if (token) {
    const {
      payload: { key, accountType },
      status: validationStatus,
    } = AccountManager.validateToken(token);

    if (validationStatus.has(StatusCode.VALID_TOKEN)) {
      if (typeof key === "string" && Array.isArray(status)) {
        if (accountType === AccountTypes.PERSONAL) {
          const { bookings, status: s } = await Booking.fromOwner(
            key,
            status as BookingStatus[]
          );

          res.status(200).json({ bookings, status: s.get() });
        } else if (accountType === AccountTypes.DRIVER) {
          const { bookings, status: s } = await Booking.find(
            ...(status as BookingStatus[])
          );
          res.status(200).json({ bookings, status: s.get() });
        } else {
          res.status(500);
        }
      } else {
        res.status(500);
      }
    } else {
      res.status(401);
    }
  } else {
    res.status(401);
  }
}

export default handler;
