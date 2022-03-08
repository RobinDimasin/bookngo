import { NextRequest, NextFetchEvent, NextResponse } from "next/server";
import { getEndpoint } from "../../frontend/util";
import { Account } from "../../server/account";
import { StatusCode } from "../../shared/status";

export function withoutAuth(...types: (keyof typeof Account)[]) {
  return async (req: NextRequest, ev: NextFetchEvent) => {
    const accessToken = req.cookies.accessToken;

    if (accessToken) {
      const validations = await Promise.all(
        types.map(async (type) => {
          const url = getEndpoint(`/api/account/validateToken?type=${type}`);

          const response = await fetch(url, {
            method: "post",
            body: JSON.stringify({
              accessToken,
            }),
            headers: { "Content-Type": "application/json" },
          });

          const data = await response.json();

          return data.status.includes(StatusCode.VALID_TOKEN);
        })
      );

      if (validations.some((validation) => validation)) {
        const url = req.nextUrl.clone();
        url.pathname = "/";
        return NextResponse.redirect(url);
      }
    }
  };
}
