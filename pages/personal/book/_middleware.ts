import { withAuth } from "../../../middleware/page/withAuth";

const middleware = withAuth("personal");
export default middleware;
