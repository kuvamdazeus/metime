import jwt from "jsonwebtoken";
import SpotifyWebApi from "spotify-web-api-node";
import { IAlbum, IPlaylist } from "../../types/songs";
import { IRecommendedTrack } from "../../types/track";

const spotify = new SpotifyWebApi();

export const getArtistData = async (token: string, artistId: string) => {
  const { access_token } = jwt.verify(token, process.env.JWT_SECRET as string) as any;
  spotify.setAccessToken(access_token.access_token);

  const [{ body: artistData }, { body: artistAlbumsData }] = await Promise.all([
    spotify.getArtist(artistId),
    spotify.getArtistAlbums(artistId, { limit: 50 }),
  ]);

  const _albumNames = Array.from(new Set(artistAlbumsData.items.map((album) => album.name)));
  const _uniqueAlbums = _albumNames.map((albumName) => {
    return artistAlbumsData.items.find((album) => album.name === albumName) as SpotifyApi.AlbumObjectSimplified;
  });

  return {
    name: artistData.name,
    image: artistData.images.at(0)?.url,
    followers: artistData.followers.total,
    albums: _uniqueAlbums.map((album) => {
      return {
        id: album.id,
        name: album.name,
        image: album.images.at(0)?.url,
        type: album.album_type,
        total_tracks: album.total_tracks,
        release_date: album.release_date,
      };
    }),
  };
};

type GetAlbumData = (token: string, albumId: string) => Promise<IAlbum>;
export const getAlbumData: GetAlbumData = async (token: string, albumId: string) => {
  const { access_token } = jwt.verify(token, process.env.JWT_SECRET as string) as any;
  spotify.setAccessToken(access_token.access_token);

  const [{ body: albumData }, { body: albumTracks }] = await Promise.all([
    spotify.getAlbum(albumId),
    spotify.getAlbumTracks(albumId, { limit: 50 }),
  ]);

  return {
    name: albumData.name,
    image: albumData.images.at(0)?.url,
    type: albumData.album_type,
    artists: albumData.artists.map((artist) => artist.name),
    release_date: albumData.release_date,
    tracks: albumTracks.items.map((track) => {
      const seconds = track.duration_ms / 1000;
      const duration_seconds = Math.round((seconds / 60 - Math.floor(seconds / 60)) * 60).toString();
      const duration_minutes = Math.floor(seconds / 60).toString();
      const duration = `${duration_minutes}:${
        duration_seconds.length == 2 ? duration_seconds : "0" + duration_seconds
      }`;

      return {
        id: track.id,
        artists: track.artists.map((artist) => artist.name),
        name: track.name,
        image_url: albumData.images.at(0)?.url,
        explicit: track.explicit,
        type: track.type,
        duration,
      };
    }) as IRecommendedTrack[],
  };
};

type GetPlaylistData = (token: string, playlistID: string) => Promise<IPlaylist>;
export const getPlaylistData: GetPlaylistData = async (token: string, playlistID: string) => {
  const { access_token } = jwt.verify(token, process.env.JWT_SECRET as string) as any;
  spotify.setAccessToken(access_token.access_token);

  const [{ body: playlistData }, { body: playlistTracks }] = await Promise.all([
    spotify.getPlaylist(playlistID),
    spotify.getPlaylistTracks(playlistID),
  ]);

  return {
    id: playlistData.id,
    name: playlistData.name,
    description: playlistData.description,
    image: playlistData.images.at(0)?.url,
    type: "playlist",
    tracks: playlistTracks.items.map((playlistTrack) => {
      const track = playlistTrack.track;

      const seconds = (track?.duration_ms || 0) / 1000;
      const duration_seconds = Math.round((seconds / 60 - Math.floor(seconds / 60)) * 60).toString();
      const duration_minutes = Math.floor(seconds / 60).toString();
      const duration = `${duration_minutes}:${
        duration_seconds.length == 2 ? duration_seconds : "0" + duration_seconds
      }`;

      return {
        id: track?.id,
        artists: track?.artists.map((artist) => artist.name),
        name: track?.name,
        image_url: track?.album.images.at(0)?.url,
        explicit: track?.explicit,
        type: track?.type,
        duration,
      };
    }) as IRecommendedTrack[],
  };
};
