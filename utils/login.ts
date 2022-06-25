import axios from "axios";
import { IUser } from "../types/user";

export default async function login(code: string) {
  const res = await axios.get("/api/login?code=" + code);
  return res.data as IUser;
}
