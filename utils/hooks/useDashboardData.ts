import { useRecoilValue, useSetRecoilState } from "recoil";
import SpotifyWebApi from "spotify-web-api-js";
import playerAtom from "../../state/player";
import userAtom from "../../state/user";
import { IAlbumPoster, IPlaylistPoster } from "../../types/songs";
import { IRecommendedTrack } from "../../types/track";
import { IUser } from "../../types/user";
import { playTrack } from "../player";

const spotify = new SpotifyWebApi();

export default function useDashboardData() {
  const user = useRecoilValue(userAtom) as IUser;
  const setPlayerData = useSetRecoilState(playerAtom);

  const getDashboardItems = async () => {
    spotify.getMyCurrentPlaybackState().then((playbackData) => {
      const currentlyPlaying: IRecommendedTrack | null =
        playbackData.item?.type === "track"
          ? {
              name: playbackData.item.name,
              image_url: playbackData.item.album.images.at(0)?.url as string,
              artists: playbackData.item.artists.map((artistData) => artistData.name),
              explicit: playbackData.item.explicit,
              type: "track",
              duration: "0%",
              id: "",
            }
          : null;

      if (currentlyPlaying) playTrack(currentlyPlaying, [], { user, setPlayerData }, false);
    });

    try {
      if (parseInt(localStorage.getItem("dashboardItems_valid_till") as string) < Date.now())
        throw new Error();
      const { topAlbums, topArtists, playlists } = JSON.parse(
        localStorage.getItem("dashboardItems") as string
      );

      console.log("RETURNING CACHED RESOURCES");
      return { topAlbums, topArtists, playlists };
    } catch (err) {
      localStorage.removeItem("dashboardItems");
      localStorage.removeItem("dashboardItems_valid_till");
    }

    spotify.setAccessToken(user.access_token.access_token);

    const getTopArtists = spotify.getMyTopArtists({ limit: 15 });
    const getTopTracks = spotify.getMyTopTracks({ limit: 15 });
    const getUserPlaylists = spotify.getUserPlaylists(user.user_id, { limit: 50 });

    const [topArtistsData, topTracksData, playlistsData] = await Promise.all([
      getTopArtists,
      getTopTracks,
      getUserPlaylists,
    ]);

    const topArtists = topArtistsData.items.map((artist) => {
      return { id: artist.id, name: artist.name, image: artist.images.at(-1)?.url as string };
    });

    const _topAlbumIds = new Set<string>();
    topTracksData.items.forEach((track) => _topAlbumIds.add(track.album.id));
    const topAlbums: IAlbumPoster[] = Array.from(_topAlbumIds).map((id) => {
      const _track = topTracksData.items.find((track) => track.album.id === id);
      return {
        id: _track?.album.id as string,
        name: _track?.album.name as string,
        image: _track?.album.images.at(0)?.url as string,
        type: "album",
        total_tracks: _track?.album.total_tracks || 0,
        release_date: _track?.album.release_date || "",
      };
    });

    const playlists: IPlaylistPoster[] = playlistsData.items.map((item) => {
      return {
        id: item.id,
        name: item.name,
        description: item.description,
        total_tracks: item.tracks.total,
        images: {
          low: item.images[0].url,
          high: item.images[item.images.length - 1].url,
        },
      };
    });

    const dashboardItems = { topAlbums, topArtists, playlists };
    localStorage.setItem("dashboardItems", JSON.stringify(dashboardItems));
    localStorage.setItem("dashboardItems_valid_till", String(Date.now() + 3 * 60 * 60 * 1000));
    return dashboardItems;
  };

  return { getDashboardItems };
}
