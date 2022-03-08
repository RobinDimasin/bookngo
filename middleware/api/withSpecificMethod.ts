import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { RequestMethod } from "../../shared/types/RequestMethod";

const withSpecificMethod = (
  handler: NextApiHandler,
  methods: RequestMethod[]
) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const method = req.method as RequestMethod;
    if (method && methods.includes(method)) {
      return handler(req, res);
    } else {
      return res.status(405);
    }
  };
};

export default withSpecificMethod;
