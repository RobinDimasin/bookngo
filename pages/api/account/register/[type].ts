import type { NextApiRequest, NextApiResponse } from "next";
import withoutAuth from "../../../../middleware/api/withoutAuth";
import {
  Account,
  DriverAccount,
  PersonalAccount,
} from "../../../../server/account";
import { StatusCode } from "../../../../shared/status";
import { DriverVehicleType } from "../../../../shared/types/Driver";

type Data = {
  accessToken: string | null;
  status: Array<StatusCode>;
};

interface RegisterNextApiRequest extends NextApiRequest {
  body: Record<string, any> & {
    key: string;
    password: string;
  };
}

const validateKeys = (input: Record<string, any>, keys: string[]) => {
  return keys.every((key) => key in input);
};

async function RegisterHandler(
  req: RegisterNextApiRequest,
  res: NextApiResponse<Data>
) {
  const { type } = req.query;
  if (req.method === "POST" && typeof type === "string" && type in Account) {
    const t = type as keyof typeof Account;
    const input = req.body;

    if (t === "personal") {
      if (validateKeys(input, ["key", "password"])) {
        var { accessToken, status } = await PersonalAccount.create({
          key: input.key,
          password: input.password,
          nonce: 0,
        });
      } else {
        res.status(400);
        return;
      }
    } else if (t === "driver") {
      if (validateKeys(input, ["key", "password", "vehicle"])) {
        var { accessToken, status } = await DriverAccount.create({
          key: input.key,
          password: input.password,
          vehicle: input.vehicle ?? DriverVehicleType.MOTORCYCLE,
        });
      } else {
        res.status(400);
        return;
      }
    }

    res.status(201).json({
      accessToken,
      status: status.get(),
    });
  } else {
    res.status(405);
  }
}

export default withoutAuth(RegisterHandler, PersonalAccount);
