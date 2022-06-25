import { NextApiRequest, NextApiResponse } from "next";
import yts from "yt-search";
import validateUser from "../../utils/api/validateUser";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const valid = validateUser(req);
  if (!valid) res.status(401).json({ message: "user not valid" });

  const video = (await yts(req.query.name as string)).videos[0];
  return res.status(200).json({ url: video.url, duration: video.duration });
}
