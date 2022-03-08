import { NextApiRequest, NextApiResponse } from "next";
import * as turf from "@turf/turf";

type Data = {
  cost: number;
  units: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { lat1, lng1, lat2, lng2 } = req.query;

  if (
    typeof lat1 === "string" &&
    typeof lng1 === "string" &&
    typeof lat2 === "string" &&
    typeof lng2 === "string"
  ) {
    const x1 = parseFloat(lat1);
    const y1 = parseFloat(lng1);
    const x2 = parseFloat(lat2);
    const y2 = parseFloat(lng2);

    const units = "kilometers";

    if (isNaN(x1) || isNaN(y1) || isNaN(x2) || isNaN(y2)) {
      res.status(500);
    } else {
      res.status(200).json({
        cost: turf.length(
          turf.lineString([
            [y1, x1],
            [y2, x2],
          ]),
          { units }
        ),
        units,
      });
    }
  } else {
    res.status(500);
  }
}
