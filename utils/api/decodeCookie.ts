import { NextApiRequest } from "next";
import jwt from "jsonwebtoken";

// use only if you need cookie data, for validating user, there is already a function in utils/api
export default function decodeCookie(req: NextApiRequest): object | null {
  try {
    const { token } = req.cookies;
    return jwt.verify(token, process.env.JWT_SECRET as string) as any;
  } catch {
    return null;
  }
}
