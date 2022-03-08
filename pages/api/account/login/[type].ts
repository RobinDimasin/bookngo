import type { NextApiRequest, NextApiResponse } from "next";
import withoutAuth from "../../../../middleware/api/withoutAuth";
import { Account, PersonalAccount } from "../../../../server/account";
import { StatusCode } from "../../../../shared/status";

type Data = {
  accessToken: string | null;
  status: Array<StatusCode>;
};

interface LoginNextApiRequest extends NextApiRequest {
  body: {
    key: string;
    password: string;
  };
}

async function LoginHandler(
  req: LoginNextApiRequest,
  res: NextApiResponse<Data>
) {
  const { type } = req.query;

  if (req.method === "POST" && typeof type === "string" && type in Account) {
    const t = type as keyof typeof Account;
    const { key, password } = req.body;

    const { accessToken, status } = await Account[t].login(key, password);

    res.status(201).json({
      accessToken,
      status: status.get(),
    });
  } else {
    res.status(405);
  }
}

export default withoutAuth(LoginHandler, PersonalAccount);
