import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import cookie from "cookie";
import jwt from "jsonwebtoken";
import { client } from "../../supabase";
import decodeCookie from "../../utils/api/decodeCookie";
import { IUser } from "../../types/user";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { refresh_token, user_id } = decodeCookie(req) as any;

  try {
    const { data } = await axios.post(
      `https://accounts.spotify.com/api/token?grant_type=refresh_token&refresh_token=${refresh_token}`,
      null,
      {
        headers: {
          Authorization:
            "Basic " +
            Buffer.from(process.env.NEXT_PUBLIC_SPOTIFY_ID + ":" + process.env.SPOTIFY_SECRET).toString("base64"),
        },
      }
    );

    const { body } = await client
      .from("users")
      .update({ access_token: { access_token: data.access_token, valid_till: Date.now() + 3600 * 1000 } })
      .eq("user_id", user_id);

    if (body) {
      const user: IUser = body[0];
      res.setHeader("Set-Cookie", [
        cookie.serialize(
          "token",
          jwt.sign(
            { user_id: user.user_id, access_token: user.access_token, refresh_token },
            process.env.JWT_SECRET as string
          ),
          {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            path: "/",
          }
        ),
      ]);

      return res.status(200).json(body[0]);
    }
    return res.status(400).send("Oops, something went wrong");

    //
  } catch (err) {
    console.log(err);
    return res.status(400).send("Oops, something went wrong");
  }
}
