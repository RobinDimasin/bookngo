import { Logger } from "../../shared/Logger";
import { Status, StatusCode } from "../../shared/status";

import { DriverVehicleType } from "../../shared/types/Driver";
import { AccountTypes } from "../../shared/types/AccountTypes";

import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { ST } from "next/dist/shared/lib/utils";
dotenv.config();

export class AccountManager {
  static validateToken(token: string, type?: string) {
    const status = new Status();
    const payload: { key: string | null; accountType: AccountTypes | null } = {
      key: null,
      accountType: null,
    };

    try {
      const p = jwt.verify(token, process.env.JWT_SECRET!);

      if (typeof p !== "string" && "key" in p && "accountType" in p) {
        payload.key = p.key;
        payload.accountType = p.accountType as AccountTypes;

        if (type && payload.accountType !== type) {
          throw new Error(StatusCode.INVALID_TOKEN);
        }
      } else {
        throw new Error(StatusCode.INVALID_TOKEN);
      }

      status.add(StatusCode.VALID_TOKEN);
    } catch (e) {
      status.add(StatusCode.INVALID_TOKEN);
    }

    return {
      payload,
      status,
    };
  }
}

export const AccountFactory = <
  V extends Record<string, any>,
  T extends AccountTypes
>(
  type: T,
  schema: mongoose.SchemaDefinition<mongoose.SchemaDefinitionType<V>>
) => {
  type AccountType = V & { key: string; password: string };

  return class AccountMngr extends AccountManager {
    static readonly logger = Logger.new(type.toUpperCase());
    static readonly schema = {
      ...schema,
      key: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      accountType: { type: String, required: true },
    } as mongoose.SchemaDefinition<mongoose.SchemaDefinitionType<AccountType>>;
    static readonly Model =
      (mongoose.models[type] as mongoose.Model<AccountType>) ||
      mongoose.model(
        type,
        new mongoose.Schema<AccountType>(AccountMngr.schema, {
          timestamps: true,
        })
      );

    static async login(key: string, password: string) {
      const status = new Status();

      let accessToken: string | null = null;

      if (await AccountMngr.isRegistered(key)) {
        const account = await AccountMngr.Model.findOne({
          key,
        });

        if (account) {
          if (account.password === password) {
            accessToken = jwt.sign(
              { key: account.key, accountType: type },
              process.env.JWT_SECRET!,
              { expiresIn: "7d" }
            );
            status.add(StatusCode.CORRECT_PASSWORD);
          } else {
            status.add(StatusCode.INCORRECT_PASSWORD);
          }
        } else {
          status.add(StatusCode.ACCOUNT_DOES_NOT_EXISTS);
        }
      } else {
        status.add(StatusCode.ACCOUNT_DOES_NOT_EXISTS);
      }

      return {
        accessToken,
        status,
      };
    }

    static async create(data: AccountType) {
      const status = new Status();
      let accessToken: string | null = null;

      if (await AccountMngr.isRegistered(data.key)) {
        status.add(StatusCode.ACCOUNT_EXISTS);
      } else {
        const account = await new AccountMngr.Model({
          ...data,
          accountType: type,
        }).save();

        AccountMngr.logger.log(`New: ${account.key}`);

        status.add(StatusCode.ACCOUNT_SUCCESSFULLY_CREATED);

        const { accessToken: token } = await AccountMngr.login(
          data.key,
          data.password
        );

        accessToken = token;
      }

      return {
        accessToken,
        status,
      };
    }

    static validateToken(token: string) {
      const { payload, status } = super.validateToken(token);

      if (payload.accountType !== type) {
        status.delete(StatusCode.VALID_TOKEN);
        status.add(StatusCode.INVALID_TOKEN);
      }

      return {
        payload,
        status,
      };
    }

    static async getDetails(key: string) {
      const status = new Status();
      const account = await AccountMngr.Model.findOne({ key });
      if (account) {
        account.password = "";
        status.add(StatusCode.ACCOUNT_EXISTS);
      } else {
        status.add(StatusCode.ACCOUNT_DOES_NOT_EXISTS);
      }

      return {
        account,
        status,
      };
    }

    static async isRegistered(key: string) {
      const x = !!(await AccountMngr.Model.findOne({ key }));
      return x;
    }

    static async registeredCount() {
      return (await AccountMngr.Model.find()).length;
    }
  };
};

export const PersonalAccount = AccountFactory<
  { nonce: number },
  AccountTypes.PERSONAL
>(AccountTypes.PERSONAL, {
  nonce: { type: Number, required: true, default: 0 },
});
export const DriverAccount = AccountFactory<
  {
    vehicle: DriverVehicleType;
  },
  AccountTypes.DRIVER
>(AccountTypes.DRIVER, {
  vehicle: {
    type: String,
    required: true,
    default: DriverVehicleType.MOTORCYCLE,
  },
});

export const Account = {
  personal: PersonalAccount,
  driver: DriverAccount,
} as const;
