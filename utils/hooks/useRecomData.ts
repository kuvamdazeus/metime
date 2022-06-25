import { useRecoilState, useRecoilValue } from "recoil";
import { dashboardAtom } from "../../state/dashboard";
import userAtom from "../../state/user";
import { IRecommendedTrack } from "../../types/track";
import { IUser } from "../../types/user";
import { getSpotifySongsFromIds } from "../dataFetching";

export default function useRecomData() {
  const [dashboardData, setDashboardData] = useRecoilState(dashboardAtom);
  const user = useRecoilValue(userAtom) as IUser;

  const saveRecommendations = async (current_batch = 0) => {
    if (!user || !user.tracks) return null;

    console.log("save recoms", current_batch);
    // if (dashboardData) current_batch = dashboardData.current_batch;

    const resTracks = await getSpotifySongsFromIds(user.tracks.items[current_batch], user);
    const recomTracks: IRecommendedTrack[] = resTracks.tracks.map((track) => {
      const seconds = track.duration_ms / 1000;
      const duration_seconds = Math.round((seconds / 60 - Math.floor(seconds / 60)) * 60).toString();
      const duration_minutes = Math.floor(seconds / 60).toString();
      const duration = `${duration_minutes}:${
        duration_seconds.length == 2 ? duration_seconds : "0" + duration_seconds
      }`;

      return {
        id: track.id,
        artists: track.artists.map((artistData) => artistData.name),
        name: track.name,
        image_url: track.album.images[0].url,
        explicit: track.explicit,
        duration,
      };
    });

    setDashboardData({ current_batch, fetched_tracks: recomTracks });
  };

  return { saveRecommendations };
}
