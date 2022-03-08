import { withoutAuth } from "../../middleware/page/withoutAuth";
import { AccountTypes } from "../../shared/types/AccountTypes";

export const middleware = withoutAuth(
  AccountTypes.PERSONAL,
  AccountTypes.DRIVER
);
