export interface IUser {
  user_id: string;
  access_token: { access_token: string; valid_till: number };
  refresh_token: string;
  metadata: { name: string; image_url: string | null };
  created_at?: number;
  tracks: {
    main_cluster_number: number;
    secondary_cluster_number: number;
    items: string[][];
  } | null;
}
