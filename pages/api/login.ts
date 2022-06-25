import axios from "axios";
import SpotifyWebApi from "spotify-web-api-node";
import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import cookie from "cookie";
import { client } from "../../supabase";

const spotify = new SpotifyWebApi();

// returns:
//   { user: IUser, token: string (jwt { user_id: id, access_token: accessTokenData, refresh_token }) }
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const code = req.query.code;
  if (!code) return res.status(400).send("Auth code not provided");

  try {
    const axiosRes = await axios.post(
      `https://accounts.spotify.com/api/token?code=${code}&redirect_uri=${process.env.NEXT_PUBLIC_REDIRECT_URI}&grant_type=authorization_code`,
      null,
      {
        headers: {
          Authorization:
            "Basic " +
            Buffer.from(process.env.NEXT_PUBLIC_SPOTIFY_ID + ":" + process.env.SPOTIFY_SECRET).toString("base64"),
        },
      }
    );

    const { access_token, refresh_token } = axiosRes.data;

    spotify.setAccessToken(access_token);
    const {
      body: { display_name, images, id },
    } = await spotify.getMe();

    const accessTokenData = { access_token, valid_till: Date.now() + 3600 * 1000 };
    const user = {
      user_id: id,
      access_token: accessTokenData,
      refresh_token,
      metadata: {
        image_url: images ? images[0].url : null,
        name: display_name as string,
      },
    };
    const dbUser = await client.from("users").upsert(user);

    res.setHeader("Set-Cookie", [
      cookie.serialize(
        "token",
        jwt.sign({ user_id: id, access_token: accessTokenData, refresh_token }, process.env.JWT_SECRET as string),
        {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          path: "/",
        }
      ),
    ]);

    if (dbUser.body) return res.status(200).json(dbUser.body[0]);
    console.log(dbUser, dbUser.body);
    return res.status(400).json({ message: "its dbUser" });

    //
  } catch (err) {
    // assuming supabase & spotify api aren't down, blame the user for wrong auth code!
    console.log(err);
    return res.status(400).send("Oops, something went wrong!");
  }
}
