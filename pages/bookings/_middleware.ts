import { withAuth } from "../../middleware/page/withAuth";
import { AccountTypes } from "../../shared/types/AccountTypes";

const middleware = withAuth(AccountTypes.PERSONAL);

export default middleware;
