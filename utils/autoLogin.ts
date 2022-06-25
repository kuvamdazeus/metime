import { IUser } from "../types/user";
import axios from "axios";

export default async function autoLogin() {
  console.log("Logging in");
  const res = await axios.get("/api/user");
  console.log("AUTO LOGIN SUCCESS", res.status);
  console.log(res.data);
  return res.data as IUser;
}
