import { GetServerSideProps, NextApiRequest } from "next";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import SpotifyWebApi from "spotify-web-api-js";
import Song from "../../components/Song";
import userAtom from "../../state/user";
import { IPlaylist } from "../../types/songs";
import { IRecommendedTrack } from "../../types/track";
import { getPlaylistData } from "../../utils/api/dataFetching";
import validateUser from "../../utils/api/validateUser";

const spotify = new SpotifyWebApi();

interface Props {
  playlist: IPlaylist;
}

export default function PlaylistPage({ playlist }: Props) {
  const user = useRecoilValue(userAtom);

  const [playlistState, setPlaylistState] = useState(playlist);

  useEffect(() => {
    let offset = playlist.tracks.length;

    const main = async () => {
      if (!user) return;
      if (offset !== 100) return;

      spotify.setAccessToken(user.access_token.access_token);

      console.log("fetching tracks at offset:", offset);
      const playlistTracks = await spotify.getPlaylistTracks(playlistState.id, { offset, limit: 100 });

      const tracks = playlistTracks.items.map((playlistTrack) => {
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
          duration,
        };
      }) as IRecommendedTrack[];

      console.log("setting newly fetched tracks", playlistState.tracks.concat(tracks));
      setPlaylistState({
        ...playlistState,
        tracks: playlistState.tracks
          .concat(tracks)
          .filter((playlistTrack) => playlistTrack.id != undefined || playlistTrack.duration !== "0:00"),
      });

      offset += 100;

      if (tracks.length === 100) {
        main();
      }
    };

    main();
  }, [user]);

  return (
    <>
      <section className="pb-24 relative min-h-screen bg-[#242424]">
        <header className="relative h-[350px]">
          <img
            src={playlistState.image}
            className="
              absolute top-0 left-0 w-full h-full object-cover object-center opacity-75
              filter blur-[50px]
            "
          />

          <section className="absolute w-full h-full flex flex-col justify-between">
            <div />
            <section className="flex items-center px-10">
              <div className="border-[0.1rem] border-[#ffffff81] rounded">
                <img src={playlistState.image} className="w-56 rounded object-contain" />
              </div>
              <div>
                <p className="text-xs font-light tracking-[0.1rem] text-gray-100 mx-10">
                  {playlistState.type.toUpperCase()}
                </p>
                <p className="text-[44px] tracking-[0.05rem] text-white font-extrabold mx-10">{playlistState.name}</p>
                <p className="text-xs font-bold tracking-[0.1rem] text-gray-100 mx-10">
                  {user && <span>{user.metadata.name}</span>}
                  {playlistState.tracks.length > 0 && (
                    <>
                      {" · "}
                      <span className="font-bold tracking-[0.05rem]">
                        {playlistState.tracks.length} {playlistState.tracks.length > 1 ? "SONGS" : "SONG"}
                      </span>
                    </>
                  )}
                </p>
              </div>
            </section>
            <div />
          </section>
        </header>

        {/* playlists go here */}
        <section className="text-white">
          {playlistState.tracks.map((track) => {
            console.log(track);
            return <Song song={track} group={playlistState.tracks} />;
          })}
        </section>
      </section>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ query, req }) => {
  const user_id = validateUser(req as NextApiRequest);
  if (!user_id) return { props: {}, redirect: { destination: "/" } };

  const playlistID = query.id;
  try {
    const data = await getPlaylistData(req.cookies.token, playlistID as string);
    return { props: { playlist: data } };

    //
  } catch (err) {
    console.log("ERROR while getting playlist data", err);
    return { props: {}, redirect: { destination: "/" } };
  }
};
