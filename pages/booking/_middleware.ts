import { withAuth } from "../../middleware/page/withAuth";
import { AccountTypes } from "../../shared/types/AccountTypes";

export const middleware = withAuth(AccountTypes.PERSONAL, AccountTypes.DRIVER);
