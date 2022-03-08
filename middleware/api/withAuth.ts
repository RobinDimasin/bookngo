import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { DriverAccount, PersonalAccount } from "../../server/account";
import { StatusCode } from "../../shared/status";

const withAuth = (
  handler: NextApiHandler,
  ...accountManagers: (typeof PersonalAccount | typeof DriverAccount)[]
) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    let token: string | undefined;

    if (req.cookies.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      return res.status(401).json({
        status: [StatusCode.NOT_LOGGED_IN],
      });
    }

    const { accessToken } = req.cookies;

    const validations = accountManagers.map((mngr) => {
      const { status } = mngr.validateToken(accessToken);

      return status.has(StatusCode.VALID_TOKEN);
    });

    if (validations.some((validation) => validation)) {
      return handler(req, res);
    } else {
      return res.status(401);
    }
  };
};

export default withAuth;
