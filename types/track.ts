export interface IRecommendedTrack {
  id: string;
  artists: string[];
  name: string;
  image_url: string;
  duration: string;
  explicit: boolean;
  type: "track" | undefined;
}

export interface IQueueTrack {
  id: string;
  artists: string[];
  name: string;
  image_url: string;
  yt_url: string;
  duration: string; // 3:09 proper text
}
