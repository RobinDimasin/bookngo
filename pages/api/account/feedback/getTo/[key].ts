import { NextApiRequest, NextApiResponse } from "next";
import { FeedbackManager } from "../../../../../server/feedback";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const { key } = req.query;

    if (typeof key === "string") {
      res.status(200).json({
        feedbacks: await FeedbackManager.getTo(key),
      });
    } else {
      res.status(500);
    }
  } else {
    res.status(405);
  }
}

export default handler;
