import { NextApiRequest, NextApiResponse } from "next";
import { client } from "../../supabase";
import validateUser from "../../utils/api/validateUser";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user_id = validateUser(req);
  if (!user_id) res.status(401).json({ message: "user not valid" });

  const { data } = await client.from("users").select().eq("user_id", user_id);
  if (data) return res.status(200).json(data[0]);

  // its fucked up if this runs
  console.log(data, user_id);
  return res.status(400).json({ message: "Oops, an error occured while fetching user, check BE" });
}
