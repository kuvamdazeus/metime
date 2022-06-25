import { IRecommendedTrack } from "./track";

export interface IDashboardData {
  current_batch: number;
  fetched_tracks: IRecommendedTrack[];
}
