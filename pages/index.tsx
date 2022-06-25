import { useRecoilValue } from "recoil";
import userAtom from "../state/user";
import useSessionCheck from "../utils/hooks/useSessionCheck";
import Dashboard from "../components/Dashboard";
import LoginScreen from "../components/LoginScreen";

// interface Props {
//   userLoggedIn: boolean;
// }

export default function Home() {
  useSessionCheck();

  const user = useRecoilValue(userAtom);

  const authCodeUri =
    "https://accounts.spotify.com/authorize?" +
    "response_type=code&client_id=" +
    process.env.NEXT_PUBLIC_SPOTIFY_ID +
    "&" +
    "redirect_uri=" +
    process.env.NEXT_PUBLIC_REDIRECT_URI +
    "&" +
    "scope=" +
    "user-read-currently-playing user-follow-read user-library-read user-library-modify " +
    "user-top-read user-read-recently-played user-read-playback-state playlist-modify-public " +
    "playlist-modify-private";

  if (user)
    return (
      <section className="flex h-screen bg-[#333333]">
        {/* <section className="w-1/4">
          <Sidebar />
        </section> */}
        <section className="w-full overflow-y-scroll">
          <Dashboard />
        </section>
      </section>
    );

  return <LoginScreen authCodeUri={authCodeUri} />;
}
