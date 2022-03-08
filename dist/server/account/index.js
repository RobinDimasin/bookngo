"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Account = exports.DriverAccount = exports.PersonalAccount = exports.AccountFactory = exports.AccountManager = void 0;
const Logger_1 = require("../../shared/Logger");
const status_1 = require("../../shared/status");
const Driver_1 = require("../../shared/types/Driver");
const AccountTypes_1 = require("../../shared/types/AccountTypes");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class AccountManager {
    static validateToken(token, type) {
        const status = new status_1.Status();
        const payload = {
            key: null,
            accountType: null,
        };
        try {
            const p = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            if (typeof p !== "string" && "key" in p && "accountType" in p) {
                payload.key = p.key;
                payload.accountType = p.accountType;
                if (type && payload.accountType !== type) {
                    throw new Error(status_1.StatusCode.INVALID_TOKEN);
                }
            }
            else {
                throw new Error(status_1.StatusCode.INVALID_TOKEN);
            }
            status.add(status_1.StatusCode.VALID_TOKEN);
        }
        catch (e) {
            status.add(status_1.StatusCode.INVALID_TOKEN);
        }
        return {
            payload,
            status,
        };
    }
}
exports.AccountManager = AccountManager;
const AccountFactory = (type, schema) => {
    var _a;
    return _a = class AccountMngr extends AccountManager {
            static async login(key, password) {
                const status = new status_1.Status();
                let accessToken = null;
                if (await AccountMngr.isRegistered(key)) {
                    const account = await AccountMngr.Model.findOne({
                        key,
                    });
                    if (account) {
                        if (account.password === password) {
                            accessToken = jsonwebtoken_1.default.sign({ key: account.key, accountType: type }, process.env.JWT_SECRET, { expiresIn: "7d" });
                            status.add(status_1.StatusCode.CORRECT_PASSWORD);
                        }
                        else {
                            status.add(status_1.StatusCode.INCORRECT_PASSWORD);
                        }
                    }
                    else {
                        status.add(status_1.StatusCode.ACCOUNT_DOES_NOT_EXISTS);
                    }
                }
                else {
                    status.add(status_1.StatusCode.ACCOUNT_DOES_NOT_EXISTS);
                }
                return {
                    accessToken,
                    status,
                };
            }
            static async create(data) {
                const status = new status_1.Status();
                let accessToken = null;
                if (await AccountMngr.isRegistered(data.key)) {
                    status.add(status_1.StatusCode.ACCOUNT_EXISTS);
                }
                else {
                    const account = await new AccountMngr.Model(Object.assign(Object.assign({}, data), { accountType: type })).save();
                    AccountMngr.logger.log(`New: ${account.key}`);
                    status.add(status_1.StatusCode.ACCOUNT_SUCCESSFULLY_CREATED);
                    const { accessToken: token } = await AccountMngr.login(data.key, data.password);
                    accessToken = token;
                }
                return {
                    accessToken,
                    status,
                };
            }
            static validateToken(token) {
                const { payload, status } = super.validateToken(token);
                if (payload.accountType !== type) {
                    status.delete(status_1.StatusCode.VALID_TOKEN);
                    status.add(status_1.StatusCode.INVALID_TOKEN);
                }
                return {
                    payload,
                    status,
                };
            }
            static async getDetails(key) {
                const status = new status_1.Status();
                const account = await AccountMngr.Model.findOne({ key });
                if (account) {
                    account.password = "";
                    status.add(status_1.StatusCode.ACCOUNT_EXISTS);
                }
                else {
                    status.add(status_1.StatusCode.ACCOUNT_DOES_NOT_EXISTS);
                }
                return {
                    account,
                    status,
                };
            }
            static async isRegistered(key) {
                const x = !!(await AccountMngr.Model.findOne({ key }));
                return x;
            }
            static async registeredCount() {
                return (await AccountMngr.Model.find()).length;
            }
        },
        _a.logger = Logger_1.Logger.new(type.toUpperCase()),
        _a.schema = Object.assign(Object.assign({}, schema), { key: { type: String, required: true, unique: true }, password: { type: String, required: true }, accountType: { type: String, required: true } }),
        _a.Model = mongoose_1.default.models[type] ||
            mongoose_1.default.model(type, new mongoose_1.default.Schema(_a.schema, {
                timestamps: true,
            })),
        _a;
};
exports.AccountFactory = AccountFactory;
exports.PersonalAccount = (0, exports.AccountFactory)(AccountTypes_1.AccountTypes.PERSONAL, {
    nonce: { type: Number, required: true, default: 0 },
});
exports.DriverAccount = (0, exports.AccountFactory)(AccountTypes_1.AccountTypes.DRIVER, {
    vehicle: {
        type: String,
        required: true,
        default: Driver_1.DriverVehicleType.MOTORCYCLE,
    },
});
exports.Account = {
    personal: exports.PersonalAccount,
    driver: exports.DriverAccount,
};
