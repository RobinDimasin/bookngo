import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { DriverAccount, PersonalAccount } from "../../server/account";
import { StatusCode } from "../../shared/status";

const withoutAuth = (
  handler: NextApiHandler,
  accountManager: typeof PersonalAccount | typeof DriverAccount
) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    let token: string | undefined;

    if (req.cookies.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      return handler(req, res);
    }

    const { accessToken } = req.cookies;
    const { status } = accountManager.validateToken(accessToken);

    if (status.has(StatusCode.INVALID_TOKEN)) {
      return handler(req, res);
    } else {
      return res.status(401).json({
        status: [StatusCode.ALREADY_LOGGED_IN],
      });
    }
  };
};

export default withoutAuth;
