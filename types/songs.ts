import { IRecommendedTrack } from "./track";

export interface IPlaylistPoster {
  id: string;
  name: string;
  description: string | null;
  total_tracks: number;
  images: {
    low: string;
    high: string;
  };
}

export interface IAlbumPoster {
  id: string;
  name: string;
  image: string | undefined;
  type: "album" | "single" | "compilation";
  total_tracks: number;
  release_date: string;
}

export interface IArtist {
  name: string;
  image: string | undefined;
  followers: number;
  albums: IAlbumPoster[];
}

export interface IAlbum {
  name: string;
  image: string | undefined;
  type: "album" | "single" | "compilation";
  artists: string[];
  release_date: string;
  tracks: IRecommendedTrack[];
}

export interface IPlaylist {
  id: string;
  name: string;
  description: string | null;
  image: string | undefined;
  type: "playlist";
  tracks: IRecommendedTrack[];
}
