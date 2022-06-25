import axios from "axios";

export default async function refreshSession() {
  console.log("REFRESHING SESSION");
  return (await axios.get("/api/refresh_token")).data;
}
