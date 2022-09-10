import { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  MdOutlinePlayCircleFilled,
  MdOutlinePauseCircleFilled,
  MdOutlineFullscreen,
  MdSkipNext,
  MdSkipPrevious,
  MdForward10,
  MdForward30,
  MdReplay10,
  MdReplay30,
  MdPlaylistAdd,
  MdClose,
  MdQueueMusic,
} from "react-icons/md";
import SpotifyWebApi from "spotify-web-api-js";
import playerAtom, { playerFullscreenAtom } from "../state/player";
import { playNextTrackInQueue, playPreviousTrackInQueue } from "../utils/player";
import FullscreenPlayer from "./FullscreenPlayer";
import userAtom from "../state/user";
import { IPlaylistPoster } from "../types/songs";
import useToast from "../utils/hooks/useToast";
import Queue from "./Queue";

const spotify = new SpotifyWebApi();

export default function Player() {
  const toggleToast = useToast();

  const playerRef = useRef<ReactPlayer | null>(null);

  const [durationBarInterval, setDurationBarInterval] = useState<NodeJS.Timer | null>(null);
  const [durationPercent, setDurationPercent] = useState("");
  const [showPlaylistsPrompt, setShowPlaylistsPrompt] = useState(false);
  const [playlistsLastFetched, setPlaylistsLastFetched] = useState(1655880000000);
  const [playlists, setPlaylists] = useState<IPlaylistPoster[]>([]);
  const [queueIsOpened, setQueueIsOpened] = useState(false);

  const user = useRecoilValue(userAtom);

  const [playerData, setPlayerData] = useRecoilState(playerAtom);
  const [playerFullscreen, setPlayerFullscreen] = useRecoilState(playerFullscreenAtom);

  if (user) spotify.setAccessToken(user.access_token.access_token);

  useEffect(() => {
    console.log("PLAYER STATE CHANGE (useEffect)", playerData);

    const updateDurationBar = () => {
      const fractionDone = playerRef.current ? playerRef.current.getCurrentTime() / playerRef.current.getDuration() : 0;
      setDurationPercent(`${Math.round(fractionDone * 100)}%`);
    };

    if (playerData?.playing && !durationBarInterval) setDurationBarInterval(setInterval(updateDurationBar, 1000));
    else if (!playerData?.playing) {
      clearInterval(durationBarInterval as NodeJS.Timeout);
      setDurationBarInterval(null);
    }
  }, [playerData]);

  useEffect(() => {
    async function fetchUserPlaylists() {
      if (Date.now() - playlistsLastFetched <= 1 * 60 * 60 * 1000) {
        console.log("using cache for playlistsPrompt");
        return;
      }

      const res = await spotify.getUserPlaylists();

      const userPlaylists = res.items.map((playlist) => {
        return {
          id: playlist.id,
          name: playlist.name,
          description: playlist.description,
          total_tracks: playlist.tracks.total,
          images: {
            low: playlist.images.at(0) ? playlist.images.at(0)?.url : "",
            high: playlist.images.at(-1) ? playlist.images.at(-1)?.url : "",
          },
        };
      }) as IPlaylistPoster[];

      setPlaylists(userPlaylists);
      setPlaylistsLastFetched(Date.now());
    }

    if (showPlaylistsPrompt) fetchUserPlaylists();
  }, [showPlaylistsPrompt]);

  let CurrentPlayer = <></>;

  if (!playerFullscreen)
    CurrentPlayer = (
      <>
        {playerData && (
          <section className="z-0 fixed bottom-0 w-full h-20">
            <img src={playerData.current_song.image_url} className="filter blur-[35px] w-full h-full object-cover" />
          </section>
        )}
        <section className="h-22 fixed bottom-0 w-full text-white">
          <section
            className="flex items-center py-2 h-20"
            // style={{ backgroundImage: playerData ? `url('${playerData.current_song.image_url}')` : "none" }}
          >
            {playerData ? (
              <div className="flex items-center w-1/3">
                <img src={playerData?.current_song.image_url} className="ml-3 object-contain h-12" />

                <div className="ml-2">
                  <p className="font-bold text-sm">{playerData.current_song.name}</p>
                  <p className="text-gray-300 font-light text-xs">{playerData.current_song.artists.join(", ")}</p>
                </div>
              </div>
            ) : (
              <div className="w-1/3" />
            )}

            <div className="flex justify-center items-center w-1/3">
              <MdSkipPrevious
                onClick={() => playPreviousTrackInQueue({ playerData, setPlayerData })}
                className="mx-2 text-[28px] cursor-pointer opacity-75 hover:opacity-100"
              />
              <MdReplay30
                onClick={() => playerRef.current?.seekTo((playerRef.current as ReactPlayer).getCurrentTime() - 30)}
                className="mx-2 text-[28px] cursor-pointer opacity-75 hover:opacity-100"
              />
              <MdReplay10
                onClick={() => playerRef.current?.seekTo((playerRef.current as ReactPlayer).getCurrentTime() - 10)}
                className="mx-2 text-[28px] cursor-pointer opacity-75 hover:opacity-100"
              />

              {!playerData?.playing ? (
                <MdOutlinePlayCircleFilled
                  onClick={() => playerData && setPlayerData({ ...playerData, playing: !playerData.playing })}
                  className="mx-2 text-[52px] cursor-pointer"
                />
              ) : (
                <MdOutlinePauseCircleFilled
                  onClick={() => playerData && setPlayerData({ ...playerData, playing: !playerData.playing })}
                  className="mx-2 text-[52px] cursor-pointer opacity-75 hover:opacity-100"
                />
              )}

              <MdForward10
                onClick={() => playerRef.current?.seekTo((playerRef.current as ReactPlayer).getCurrentTime() + 10)}
                className="mx-2 text-[28px] cursor-pointer opacity-75 hover:opacity-100"
              />
              <MdForward30
                onClick={() => playerRef.current?.seekTo((playerRef.current as ReactPlayer).getCurrentTime() + 30)}
                className="mx-2 text-[28px] cursor-pointer opacity-75 hover:opacity-100"
              />
              <MdSkipNext
                onClick={() => playNextTrackInQueue({ playerData, setPlayerData })}
                className="mx-2 text-[28px] cursor-pointer opacity-75 hover:opacity-100"
              />
            </div>

            {playerData ? (
              <div className="flex items-center justify-end w-1/3">
                {showPlaylistsPrompt ? (
                  <MdClose
                    onClick={() => setShowPlaylistsPrompt(false)}
                    className="duration-300 text-[28px] cursor-pointer hover:scale-125"
                  />
                ) : (
                  <MdPlaylistAdd
                    onClick={() => setShowPlaylistsPrompt(true)}
                    className="duration-300 text-[28px] cursor-pointer hover:scale-125"
                  />
                )}

                <MdOutlineFullscreen
                  onClick={() => setPlayerFullscreen(true)}
                  className="duration-300 mx-3 text-[28px] cursor-pointer hover:scale-125"
                />

                <MdQueueMusic
                  onClick={() => setQueueIsOpened(!queueIsOpened)}
                  className="duration-300 mr-3 text-[28px] cursor-pointer hover:scale-125"
                />
              </div>
            ) : (
              <div className="w-1/3" />
            )}
          </section>

          <section className="w-full">
            <div
              className="h-1.5 rounded-full bg-blue-400 transition-all duration-1000"
              style={{ width: durationPercent }}
            />
          </section>
        </section>
      </>
    );
  else
    CurrentPlayer = (
      <section className="h-[100vh] w-[100vw] bottom-0 fixed">
        <FullscreenPlayer playerRef={playerRef} />
      </section>
    );

  return (
    <>
      <section className="relative">
        {CurrentPlayer}

        {showPlaylistsPrompt && (
          <section className="fixed bottom-32 right-5 bg-black text-white w-72 z-50">
            {playlists.map((playlist) => (
              <div
                onClick={async () => {
                  if (playerData && playerData?.current_song) {
                    try {
                      await spotify.addTracksToPlaylist(playlist.id, [`spotify:track:${playerData.current_song.id}`]);
                      toggleToast({ message: `Added track to ${playlist.name}`, type: "message" });
                    } catch (err) {
                      toggleToast({ message: "Error adding track to playlist!", type: "error" });
                    }
                  }
                }}
                className="p-3 flex items-center cursor-pointer hover:bg-[#1b1b1b]"
              >
                <img className="font-thin rounded object-contain h-8 mr-3" src={playlist.images.low} />
                <p className="text-xs">{playlist.name}</p>
              </div>
            ))}
          </section>
        )}

        <ReactPlayer
          onStart={() => playerRef.current?.seekTo(0)}
          ref={playerRef}
          controls
          onEnded={() => playerData && playNextTrackInQueue({ playerData, setPlayerData })}
          className="hidden"
          onPlay={() => playerData && !playerData.playing && setPlayerData({ ...playerData, playing: true })}
          onPause={() => playerData && playerData.playing && setPlayerData({ ...playerData, playing: false })}
          volume={0.5}
          url={playerData?.url}
          playing={playerData?.playing}
        />
      </section>

      {queueIsOpened && <Queue setQueueIsOpened={setQueueIsOpened} />}
    </>
  );
}
