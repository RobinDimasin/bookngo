import type { NextApiRequest, NextApiResponse } from "next";
import withAuth from "../../../../middleware/api/withAuth";
import {
  AccountManager,
  DriverAccount,
  PersonalAccount,
} from "../../../../server/account";
import { Booking } from "../../../../server/booking";
import { StatusCode } from "../../../../shared/status";
import { BookingStatus } from "../../../../shared/types/Booking";

interface LoginNextApiRequest extends NextApiRequest {
  body: {
    id: string;
    status: {
      from: BookingStatus;
      to: BookingStatus;
    };
  };
}

async function BookingTakeHandler(
  req: LoginNextApiRequest,
  res: NextApiResponse
) {
  const token = req.cookies.accessToken;

  if (token) {
    if (req.method === "POST") {
      const {
        id,
        status: { to },
      } = req.body;

      const { payload, status } = AccountManager.validateToken(token);

      if (status.has(StatusCode.VALID_TOKEN) && payload.key) {
        const { booking, status: s } = await Booking.get(id);

        if (s.has(StatusCode.BOOKING_FOUND)) {
          if (booking.driver === payload.key || booking.owner === payload.key) {
            const { status: st } = await Booking.changeStatus(id, to);
            if (st.has(StatusCode.BOOKING_STATUS_CHANGED)) {
              res.status(200).json({ status: st.get() });
            }
          } else {
            res.status(401);
          }
        } else {
          res.status(500);
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

export default withAuth(BookingTakeHandler, DriverAccount, PersonalAccount);
