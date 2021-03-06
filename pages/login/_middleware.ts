import { withoutAuth } from "../../middleware/page/withoutAuth";
import { AccountTypes } from "../../shared/types/AccountTypes";

const middleware = withoutAuth(AccountTypes.PERSONAL, AccountTypes.DRIVER);

export default middleware;
