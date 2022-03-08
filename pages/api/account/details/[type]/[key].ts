import { NextApiRequest, NextApiResponse } from "next";
import {
  Account,
  DriverAccount,
  PersonalAccount,
} from "../../../../../server/account";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { key, type } = req.query;
  if (typeof type === "string" && type in Account && typeof key === "string") {
    const t = type as keyof typeof Account;

    if (t === "personal") {
      const { account, status } = await PersonalAccount.getDetails(key);

      res.status(200).json({
        account,
        status: status.get(),
      });
    } else if (t === "driver") {
      const { account, status } = await DriverAccount.getDetails(key);

      res.status(200).json({
        account,
        status: status.get(),
      });
    } else {
      res.status(405);
    }
  } else {
    res.status(500);
  }
}
