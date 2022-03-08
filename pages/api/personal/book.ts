import type { NextApiRequest, NextApiResponse } from "next";
import withAuth from "../../../middleware/api/withAuth";
import { PersonalAccount } from "../../../server/account";
import { Booking } from "../../../server/booking";
import { StatusCode } from "../../../shared/status";
import {
  BookingDetails,
  BookingDetailsExtendend,
} from "../../../shared/types/Booking";

type Data = {
  id: string | null;
  status: Array<StatusCode>;
};

interface BookNextApiRequest extends NextApiRequest {
  body: {
    details: BookingDetailsExtendend;
    token: string;
  };
}

async function BookHandler(
  req: BookNextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "POST") {
    const { details, token } = req.body;
    const { id, status } = await Booking.new(details, token);
    res.status(200).json({ id, status: status.get() });
  } else {
    res.status(405);
  }
}

export default withAuth(BookHandler, PersonalAccount);
