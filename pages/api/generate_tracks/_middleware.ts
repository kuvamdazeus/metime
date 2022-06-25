import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import validateUser from "../../../utils/api/validateUser";

export default async function handler(req: NextRequest) {
  const valid = validateUser(req as any);
  if (!valid) return new Response("User not authorized!", { status: 401 });

  const ids = new URL(req.url).searchParams.get("ids");
  const user_id = new URL(req.url).searchParams.get("user_id");
  const data = await fetch(`${process.env.NEXT_PUBLIC_ML_SERVER}/generate_tracks?ids=${ids}`, {
    headers: {
      enc_user_id: jwt.sign({ user_id }, process.env.JWT_SECRET as string),
    },
  }).then((res) => res.json());

  return new Response(JSON.stringify(data));
}
