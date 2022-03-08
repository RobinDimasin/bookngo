import type { NextApiRequest, NextApiResponse } from "next";
import { AccountManager, PersonalAccount } from "../../../server/account";
import { Booking } from "../../../server/booking";
import { StatusCode } from "../../../shared/status";
import { BookingDetailsExtendend } from "../../../shared/types/Booking";

type Data = {
  booking: BookingDetailsExtendend;
  status: Array<StatusCode>;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { id } = req.query;

  const token = req.cookies.accessToken;

  if (token) {
    const {
      payload: { key },
      status: validationStatus,
    } = AccountManager.validateToken(token);

    if (validationStatus.has(StatusCode.VALID_TOKEN)) {
      if (typeof id === "string") {
        const { booking, status: s } = await Booking.get(id);

        res.status(200).json({ booking, status: s.get() });
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
