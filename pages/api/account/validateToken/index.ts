import type { NextApiRequest, NextApiResponse } from "next";
import {
  Account,
  AccountManager,
  DriverAccount,
  PersonalAccount,
} from "../../../../server/account";
import { StatusCode } from "../../../../shared/status";

type Data = {
  payload: Object;
  accessToken: string;
  status: Array<StatusCode>;
};

interface LoginNextApiRequest extends NextApiRequest {
  body: {
    accessToken: string;
  };
}

export default async function handler(
  req: LoginNextApiRequest,
  res: NextApiResponse<Data>
) {
  const { type } = req.query;
  if (req.method === "POST") {
    const t = type as keyof typeof Account;
    const { accessToken } = req.body;

    var { payload, status } = AccountManager.validateToken(
      accessToken,
      typeof type === "string" ? type : undefined
    );

    res.status(200).json({
      payload,
      accessToken,
      status: status.get(),
    });
  } else {
    res.status(405);
  }
}
