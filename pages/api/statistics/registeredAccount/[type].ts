import { NextApiRequest, NextApiResponse } from "next";
import { DriverAccount, PersonalAccount } from "../../../../server/account";
import { AccountTypes } from "../../../../shared/types/AccountTypes";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { type } = req.query;

  if (type === AccountTypes.PERSONAL) {
    return res.status(200).json({
      count: await PersonalAccount.registeredCount(),
    });
  } else if (type === AccountTypes.DRIVER) {
    return res.status(200).json({
      count: await DriverAccount.registeredCount(),
    });
  }

  return res.status(200).json({
    count: 0,
  });
}
