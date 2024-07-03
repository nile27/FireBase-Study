// api/route.ts

import { NextApiRequest, NextApiResponse } from "next";
import { sendVerificationEmail } from "./sendVerificationEmail"; // 함수 임포트
import { verifyEmailLink } from "./verifyEmailLink";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST" && req.url === "/sendVerificationEmail") {
    await sendVerificationEmail(req, res);
  } else if (req.method === "POST" && req.url === "/verifyEmailLink") {
    await verifyEmailLink(req, res);
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
