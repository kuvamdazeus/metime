import jwt from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";
import getMongoDB from "../../mongodb";
import { client } from "../../supabase";
import validateUser from "../../utils/api/validateUser";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user_id = validateUser(req as any);
  if (!user_id) return res.status(401).send("User not authorized!");

  const { ids } = req.query;

  const db = await getMongoDB();
  const likedTracks = await db
    .collection("data")
    .find({
      id: {
        $in: (ids as string).split(","),
      },
    })
    .toArray();

  let mainCluster = 0;
  let avgType = 0;
  likedTracks.forEach((track) => (mainCluster = mainCluster + track.type));
  avgType = mainCluster / likedTracks.length;
  mainCluster = Math.round(mainCluster / likedTracks.length);

  let secondaryCluster = 0;
  if (mainCluster == Math.floor(avgType)) secondaryCluster = mainCluster + 1;
  else secondaryCluster = Math.floor(avgType);

  // 80 + 20 popularity sorted
  const [mainSongs, secondarySongs] = await Promise.all([
    db
      .collection("data")
      .aggregate([
        { $match: { type: mainCluster } },
        { $sample: { size: 80 } },
        { $sort: { popularity: -1 } },
      ])
      .toArray() as any,
    db
      .collection("data")
      .aggregate([
        { $match: { type: secondaryCluster } },
        { $sample: { size: 20 } },
        { $sort: { popularity: -1 } },
      ])
      .toArray() as any,
  ]);

  const items = [
    mainSongs
      .slice(0, 40)
      .concat(secondarySongs.slice(0, 10))
      .map((song: any) => song.id),
    mainSongs
      .slice(40)
      .concat(secondarySongs.slice(10))
      .map((song: any) => song.id),
  ];

  const update = {
    tracks: {
      main_cluster: mainCluster,
      secondary_cluster: secondaryCluster,
      items,
      generated_at: Date.now(),
    },
  };

  const { data, error } = await client.from("users").update(update).eq("user_id", user_id);
  if (error || !data) return res.status(500).json({ message: "uhh maaan!" });

  res.status(200).json(data[0]);
}
