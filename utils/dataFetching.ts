import axios from "axios";
import SpotifyWebApi from "spotify-web-api-js";
import { IPlaylistPoster } from "../types/songs";
import { IUser } from "../types/user";

const spotify = new SpotifyWebApi();

export const addToSavedSongs = async (user: IUser, songId: string) => {
  spotify.setAccessToken(user.access_token.access_token);

  try {
    await spotify.addToMySavedTracks([songId]);
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};

export const fetchRecommendedIds = async (user: IUser) => {
  if (user.tracks) return user as IUser;

  spotify.setAccessToken(user.access_token.access_token);
  const topTracks = await spotify.getMyTopTracks({ limit: 50 });

  const ids = topTracks.items.map((track) => track.id).join(",");
  const axiosRes = await axios.get(`/api/generate_tracks?ids=${ids}&user_id=${user.user_id}`);
  console.log(axiosRes.data);

  return axiosRes.data as IUser;
};

export const getSpotifySongsFromIds = async (ids: string[], user: IUser) => {
  spotify.setAccessToken(user.access_token.access_token);
  return await spotify.getTracks(ids);
};

export const getSidebarData = async (user: IUser) => {
  spotify.setAccessToken(user.access_token.access_token);

  const playlistsData = await spotify.getUserPlaylists(user.user_id, { limit: 50 });
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

  return playlists;
};
