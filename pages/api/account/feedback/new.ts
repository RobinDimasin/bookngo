import { NextApiRequest, NextApiResponse } from "next";
import withAuth from "../../../../middleware/api/withAuth";
import { DriverAccount, PersonalAccount } from "../../../../server/account";
import { FeedbackManager } from "../../../../server/feedback";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { to, from, message, rating } = req.body;

    const feedback = await FeedbackManager.new(to, from, message, rating);

    res.status(200).json({
      feedback,
      success: "true",
    });
  } else {
    res.status(405);
  }
}

export default withAuth(handler, PersonalAccount, DriverAccount);
