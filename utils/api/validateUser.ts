import { NextApiRequest } from "next";
import jwt from "jsonwebtoken";

// set bypassValidityCheck = true only if checking the PRESENCE of signed token
export default function validateUser(req: NextApiRequest, bypassValidityCheck = false) {
  try {
    const { token } = req.cookies;
    const { access_token, user_id } = jwt.verify(token, process.env.JWT_SECRET as string) as any;
    if (access_token.valid_till < Date.now() && !bypassValidityCheck) throw new Error("Access token refresh required");
    // if (access_token.valid_till < Date.now()) res.redirect('')
    return user_id as string;
  } catch (err) {
    return null;
  }
}
