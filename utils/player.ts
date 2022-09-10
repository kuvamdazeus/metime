import axios from "axios";
import { SetterOrUpdater } from "recoil";
import SpotifyWebApi from "spotify-web-api-js";
import { IPlayer } from "../types/player";
import { IRecommendedTrack } from "../types/track";
import { IUser } from "../types/user";

const spotify = new SpotifyWebApi();

interface PlayTrack {
  user: IUser | null;
  setPlayerData: SetterOrUpdater<IPlayer | null>;
}

export const playTrack = async (
  song: IRecommendedTrack,
  group: IRecommendedTrack[] = [],
  { user, setPlayerData }: PlayTrack
) => {
  if (!user) {
    console.log("No auth, cant play tracks");
    return null;
  }
  spotify.setAccessToken(user.access_token.access_token);

  console.log("\nSEARCHING YOUTUBE");
  const getSongUrl = axios.get(
    `/api/get_song_url?name=audio track for ${song.name} ${
      song.explicit ? "explicit" : ""
    } by ${song.artists.join(" ")}`
  );
  const getAudioFeatures = song.type === "track" ? spotify.getAudioFeaturesForTrack(song.id) : { energy: 0 };
  const [res, audioFeatures] = await Promise.all([getSongUrl, getAudioFeatures]);
  console.log("\nGOT URL:", res.data.url);

  setPlayerData({
    playing: true,
    previous_tracks: group.slice(
      0,
      group.findIndex((track) => track.id === song.id)
    ),
    current_song: song,
    queue: group.slice(group.findIndex((track) => track.id === song.id) + 1, group.length),
    url: res.data.url,
    track_energy: audioFeatures.energy,
  });
};

interface PlayNextTrackInQueue {
  setPlayerData: SetterOrUpdater<IPlayer | null>;
  playerData: IPlayer | null;
}
export const playNextTrackInQueue = async ({ playerData, setPlayerData }: PlayNextTrackInQueue) => {
  if (!playerData) return;
  if (playerData.queue.length === 0) return null;

  const next_track = playerData.queue[0];

  console.log("\nSEARCHING YOUTUBE", next_track);

  const getSongUrl = axios.get(
    `/api/get_song_url?name=audio track for ${next_track.name} ${
      next_track.explicit ? "explicit" : ""
    } by ${next_track.artists.join(" ")}`
  );
  const getAudioFeatures =
    next_track.type === "track" ? spotify.getAudioFeaturesForTrack(next_track.id) : { energy: 0 };

  const [res, audioFeatures] = await Promise.all([getSongUrl, getAudioFeatures]);

  console.log("\nGOT URL:", res.data.url);

  setPlayerData({
    previous_tracks: playerData.previous_tracks.concat([playerData.current_song]),
    current_song: playerData.queue[0],
    queue: playerData.queue.slice(1, playerData.queue.length),
    playing: true,
    url: res.data.url,
    track_energy: audioFeatures.energy,
  });
};

interface PlayPreviousTrackInQueue {
  setPlayerData: SetterOrUpdater<IPlayer | null>;
  playerData: IPlayer | null;
}
export const playPreviousTrackInQueue = async ({ playerData, setPlayerData }: PlayPreviousTrackInQueue) => {
  if (!playerData) return;
  if (playerData.previous_tracks.length === 0) return null;

  const previous_track = playerData.previous_tracks.at(-1) as IRecommendedTrack;

  console.log("\nSEARCHING YOUTUBE");
  const getSongUrl = axios.get(
    `/api/get_song_url?name=audio track for ${previous_track.name} ${
      previous_track.explicit ? "explicit" : ""
    } by ${previous_track.artists.join(" ")}`
  );
  const getAudioFeatures =
    previous_track.type === "track" ? spotify.getAudioFeaturesForTrack(previous_track.id) : { energy: 0 };
  const [res, audioFeatures] = await Promise.all([getSongUrl, getAudioFeatures]);
  console.log("\nGOT URL:", res.data.url);

  setPlayerData({
    previous_tracks: playerData.previous_tracks.slice(0, playerData.previous_tracks.length - 1),
    current_song: previous_track,
    queue: [playerData.current_song].concat(playerData.queue),
    playing: true,
    url: res.data.url,
    track_energy: audioFeatures.energy,
  });
};
