import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import userAtom from "../../state/user";
import { IUser } from "../../types/user";
import refreshSession from "../refreshSession";

export default function useSessionCheck() {
  const [user, setUser] = useRecoilState(userAtom);

  const [sessionCheckInterval, setSessionCheckInterval] = useState<NodeJS.Timer | null>(null);

  const checkSession = () => {
    if (!user) return;
    if (user.access_token.valid_till - Date.now() < 5 * 60 * 60 * 1000) return;

    refreshSession()
      .then()
      .catch((err) => {
        console.log("Error refreshing token", err);
      });
  };

  useEffect(() => {
    clearInterval(sessionCheckInterval as NodeJS.Timer);
    setSessionCheckInterval(setInterval(checkSession, 10000)); // change this to 3,4,5-00ms when done
  }, [user]);

  return user;
}
