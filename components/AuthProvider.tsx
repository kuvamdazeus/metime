import axios from "axios";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useRecoilState } from "recoil";
import Swal from "sweetalert2";
import userAtom from "../state/user";
import autoLogin from "../utils/autoLogin";
import { fetchRecommendedIds } from "../utils/dataFetching";
import login from "../utils/login";
import refreshSession from "../utils/refreshSession";

export default function AuthProvider({ children }: { children: JSX.Element }) {
  const router = useRouter();

  const [user, setUser] = useRecoilState(userAtom);

  useEffect(() => {
    // Wake up the recommendations server
    axios
      .get(`${process.env.NEXT_PUBLIC_ML_SERVER}`)
      .then()
      .catch(() => console.warn("ML SERVER NOT RESPONDING"));

    const user_id = localStorage.getItem("user_id");
    if (user_id)
      autoLogin()
        .then(async (data) => {
          console.log("user metadata", data.metadata);

          console.log("FETCHING RECOMS");
          const userData = await fetchRecommendedIds(data);
          console.log(userData);
          console.log("RECOMS", userData.tracks);
          setUser(userData);
        })
        .catch(async () => {
          // if autologin fails, try to refresh token
          try {
            console.log("AUTO LOGIN failed, REFRESHING SESSION...");
            const userData = await refreshSession();
            setUser(userData);
          } catch (err) {
            console.error("ERROR REFRESHING SESSION", err, "\n\n");
            console.log("AUTO LOGIN FAILED, removing saved info");
            localStorage.removeItem("user_id");
            setUser(null);
          }
        });

    const code = new URL(window.location.href).searchParams.get("code");
    const error = new URL(window.location.href).searchParams.get("error");

    if (error) {
      Swal.fire({
        title: "Error",
        text: "please try loggin in again!",
        icon: "error",
      });
    }

    if (code) {
      login(code)
        .then(async (userData) => {
          localStorage.setItem("user_id", userData.user_id);
          setUser(userData);

          console.log("FETCHING RECOMS");
          const recomUserData = await fetchRecommendedIds(userData);
          console.log("RECOMS", recomUserData.tracks);
          setUser(recomUserData);

          router.replace("/", undefined, { shallow: true });
        })
        .catch((err) => {
          console.log("ERROR LOGGING IN");
          console.error(err);
        });
    }
  }, []);

  return children;
}
