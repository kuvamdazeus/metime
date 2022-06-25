import { useRecoilValue } from "recoil";
import SpotifyWebApi from "spotify-web-api-js";
import userAtom from "../../state/user";
import { IAlbumPoster, IPlaylistPoster } from "../../types/songs";
import { IUser } from "../../types/user";

const spotify = new SpotifyWebApi();

export default function useDashboardData() {
  const user = useRecoilValue(userAtom) as IUser;

  const getDashboardItems = async () => {
    try {
      if (parseInt(localStorage.getItem("dashboardItems_valid_till") as string) < Date.now()) throw new Error();
      const { currentlyPlaying, topAlbums, topArtists, playlists } = JSON.parse(
        localStorage.getItem("dashboardItems") as string
      );

      return { currentlyPlaying, topAlbums, topArtists, playlists };
    } catch (err) {
      localStorage.removeItem("dashboardItems");
      localStorage.removeItem("dashboardItems_valid_till");
    }

    spotify.setAccessToken(user.access_token.access_token);

    const getTopArtists = spotify.getMyTopArtists({ limit: 15 });
    const getTopTracks = spotify.getMyTopTracks({ limit: 15 });
    const getCurrentPlaybackState = spotify.getMyCurrentPlaybackState();
    const getUserPlaylists = spotify.getUserPlaylists(user.user_id, { limit: 50 });

    const [topArtistsData, topTracksData, playbackData, playlistsData] = await Promise.all([
      getTopArtists,
      getTopTracks,
      getCurrentPlaybackState,
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

    let currentlyPlaying =
      playbackData.item?.type === "track"
        ? {
            name: playbackData.item.name,
            image: playbackData.item.album.images.at(0),
            artists: playbackData.item.artists.map((artistData) => artistData.name),
          }
        : null;

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

    const dashboardItems = { currentlyPlaying, topAlbums, topArtists, playlists };
    localStorage.setItem("dashboardItems", JSON.stringify(dashboardItems));
    localStorage.setItem("dashboardItems_valid_till", String(Date.now() + 3 * 60 * 60 * 1000));
    return dashboardItems;
  };

  return { getDashboardItems };
}
