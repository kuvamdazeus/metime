import { IRecommendedTrack } from "./track";

export interface IPlayer {
  playing: boolean;
  previous_tracks: IRecommendedTrack[];
  current_song: IRecommendedTrack;
  queue: IRecommendedTrack[];
  url: string;
  track_energy: number;
}
