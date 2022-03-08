import type { NextApiRequest, NextApiResponse } from "next";
import withAuth from "../../../../middleware/api/withAuth";
import withoutAuth from "../../../../middleware/api/withoutAuth";
import {
  Account,
  DriverAccount,
  PersonalAccount,
} from "../../../../server/account";
import { Booking } from "../../../../server/booking";
import { StatusCode } from "../../../../shared/status";

interface LoginNextApiRequest extends NextApiRequest {
  body: {
    id: string;
  };
}

async function BookingTakeHandler(
  req: LoginNextApiRequest,
  res: NextApiResponse
) {
  const token = req.cookies.accessToken;

  if (token) {
    if (req.method === "POST") {
      const { id } = req.body;

      const { payload, status } = DriverAccount.validateToken(token);

      if (status.has(StatusCode.VALID_TOKEN) && payload.key) {
        const { status: s } = await Booking.assign(payload.key, id);
        if (s.has(StatusCode.BOOKING_SUCCESSFULLY_ASSIGNED)) {
          res.status(200).send({
            status: status.get(),
          });
        } else {
          res.status(500).send({
            status: status.get(),
          });
        }
      } else {
        res.status(401);
      }
    } else {
      res.status(405);
    }
  } else {
    res.status(401);
  }
}

export default withAuth(BookingTakeHandler, DriverAccount);
