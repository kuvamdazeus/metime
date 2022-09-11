import { useRecoilState, useRecoilValue } from "recoil";
import { HiChevronUp, HiChevronDown, HiChevronDoubleUp, HiChevronDoubleDown } from "react-icons/hi";
import { MdClose } from "react-icons/md";
import playerAtom from "../state/player";
import { IRecommendedTrack } from "../types/track";
import { IPlayer } from "../types/player";
import { playTrack } from "../utils/player";
import userAtom from "../state/user";

interface Props {
  song: IRecommendedTrack;
}

export default function QueueSong({ song }: Props) {
  const [playerData, setPlayerData] = useRecoilState(playerAtom);
  const user = useRecoilValue(userAtom);

  const isCurrentlyPlaying = playerData?.current_song.id === song.id;

  const getAllTracks = () => {
    const prev = playerData?.previous_tracks || [];
    const current = playerData?.current_song ? [playerData.current_song] : [];
    const next = playerData?.queue || [];

    return prev.concat(current, next) as IRecommendedTrack[];
  };

  const songIndex = (() => {
    const prev = playerData?.previous_tracks || [];
    const current = playerData?.current_song ? [playerData.current_song] : [];
    const next = playerData?.queue || [];

    const songs = prev.concat(current, next) as IRecommendedTrack[];
    return songs.indexOf(song);
  })();

  const currentSongIndex = getAllTracks().indexOf(playerData?.current_song as IRecommendedTrack);

  const shiftBack = () => {
    if (isCurrentlyPlaying) {
      return setPlayerData({
        ...playerData,
        previous_tracks: playerData.previous_tracks.slice(0, playerData.previous_tracks.length - 1),
        queue: [playerData.previous_tracks.at(-1) as IRecommendedTrack]
          .concat(playerData.queue)
          .filter((track) => !!track),
      });
    }

    if (songIndex > currentSongIndex) {
      const queue = (playerData as IPlayer).queue;
      const queueSongIndex = (playerData as IPlayer).queue.indexOf(song);
      if (queueSongIndex === 0) return;

      const newQueue = queue.map((queueSong, index) => {
        if (index === queueSongIndex - 1) {
          return song;
        }

        if (index === queueSongIndex) {
          return queue[queueSongIndex - 1];
        }

        return queueSong;
      });

      setPlayerData({ ...playerData, queue: newQueue } as any);
    }

    if (songIndex < currentSongIndex) {
      const prevTracks = (playerData as IPlayer).previous_tracks;
      const prevSongIndex = (playerData as IPlayer).previous_tracks.indexOf(song);

      const newPrevTracks = prevTracks.map((prevTrack, index) => {
        if (index === prevSongIndex - 1) {
          return song;
        }

        if (index === prevSongIndex) {
          return prevTracks[prevSongIndex - 1];
        }

        return prevTrack;
      });

      setPlayerData({ ...playerData, previous_tracks: newPrevTracks } as any);
    }
  };

  const shiftForth = () => {
    if (isCurrentlyPlaying) {
      return setPlayerData({
        ...playerData,
        previous_tracks: playerData.previous_tracks
          .concat([playerData?.queue.at(0) as IRecommendedTrack])
          .filter((track) => !!track),
        queue: playerData.queue.slice(1, playerData.queue.length),
      });
    }

    if (songIndex > currentSongIndex) {
      const queue = (playerData as IPlayer).queue;
      const queueSongIndex = (playerData as IPlayer).queue.indexOf(song);
      if (queueSongIndex === 0) return;

      const newQueue = queue.map((queueSong, index) => {
        if (index === queueSongIndex + 1) {
          return song;
        }

        if (index === queueSongIndex) {
          return queue[queueSongIndex + 1];
        }

        return queueSong;
      });

      setPlayerData({ ...playerData, queue: newQueue } as any);
    }

    if (songIndex < currentSongIndex) {
      const prevTracks = (playerData as IPlayer).previous_tracks;
      const prevSongIndex = (playerData as IPlayer).previous_tracks.indexOf(song);

      const newPrevTracks = prevTracks.map((prevTrack, index) => {
        if (index === prevSongIndex + 1) {
          return song;
        }

        if (index === prevSongIndex) {
          return prevTracks[prevSongIndex + 1];
        }

        return prevTrack;
      });

      setPlayerData({ ...playerData, previous_tracks: newPrevTracks } as any);
    }
  };

  const shiftToStart = () => {
    if (isCurrentlyPlaying) {
      return setPlayerData({
        ...playerData,
        previous_tracks: [],
        queue: playerData.previous_tracks.concat(playerData.queue),
      });
    }

    if (songIndex > currentSongIndex) {
      const queue = playerData?.queue;
      const newQueue = [song].concat(
        queue?.filter((queueSong) => queueSong.id !== song.id) as IRecommendedTrack[]
      );

      setPlayerData({ ...playerData, queue: newQueue } as any);
    }

    if (songIndex < currentSongIndex) {
      const prevTracks = playerData?.previous_tracks;
      const newPrevTracks = [song].concat(
        prevTracks?.filter((prevTrack) => prevTrack.id !== song.id) as IRecommendedTrack[]
      );

      setPlayerData({ ...playerData, previous_tracks: newPrevTracks } as any);
    }
  };

  const shiftToEnd = () => {
    if (isCurrentlyPlaying) {
      return setPlayerData({
        ...playerData,
        previous_tracks: playerData.previous_tracks.concat(playerData.queue),
        queue: [],
      });
    }

    if (songIndex > currentSongIndex) {
      const queue = playerData?.queue;
      const newQueue = (queue?.filter((queueSong) => queueSong.id !== song.id) as IRecommendedTrack[]).concat(
        [song]
      );

      setPlayerData({ ...playerData, queue: newQueue } as any);
    }

    if (songIndex < currentSongIndex) {
      const prevTracks = playerData?.previous_tracks;
      const newPrevTracks = (
        prevTracks?.filter((prevTrack) => prevTrack.id !== song.id) as IRecommendedTrack[]
      ).concat([song]);

      setPlayerData({ ...playerData, previous_tracks: newPrevTracks } as any);
    }
  };

  const removeSongFromQueue = () => {
    if (songIndex > currentSongIndex) {
      const queue = playerData?.queue;
      const newQueue = queue?.filter((queueSong) => queueSong.id !== song.id) as IRecommendedTrack[];

      setPlayerData({ ...playerData, queue: newQueue } as any);
    }

    if (songIndex < currentSongIndex) {
      const prevTracks = playerData?.previous_tracks;
      const newPrevTracks = prevTracks?.filter(
        (prevTrack) => prevTrack.id !== song.id
      ) as IRecommendedTrack[];

      setPlayerData({ ...playerData, previous_tracks: newPrevTracks } as any);
    }
  };

  return (
    <section
      className={`
        px-3
        ${isCurrentlyPlaying ? "py-7" : "py-3"}
        ${isCurrentlyPlaying ? "bg-[#007816bf]" : "hover:bg-[#363636]"}
        ${!isCurrentlyPlaying && "bg-[#272727d6] hover:bg-[#363636]"}
      `}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <img src={song.image_url} className="h-12 mr-3 object-contain cursor-pointer" />

          <div className="">
            <p
              className="font-bold cursor-pointer hover:underline"
              onClick={() => {
                if (playerData) {
                  playTrack(
                    song,
                    [...playerData?.previous_tracks, playerData.current_song, ...playerData?.queue],
                    {
                      setPlayerData,
                      user,
                    }
                  );
                }
              }}
            >
              {song.name}
            </p>
            <p className="text-xs text-gray-400">{song?.artists && song.artists.join(", ")}</p>
          </div>
        </div>

        <div className="flex items-center">
          {isCurrentlyPlaying && (
            <>
              <HiChevronUp
                onClick={() => {
                  try {
                    shiftBack();
                  } catch (err) {}
                }}
                className="text-4xl cursor-pointer text-[#ffffffbc] -mr-1"
              />
              <HiChevronDown
                onClick={() => {
                  try {
                    shiftForth();
                  } catch (err) {}
                }}
                className="text-4xl cursor-pointer text-[#ffffffbc] mr-5"
              />
            </>
          )}

          <HiChevronDoubleUp
            onClick={() => {
              try {
                shiftToStart();
              } catch (err) {}
            }}
            className="text-3xl cursor-pointer text-[#ffffffbc]"
          />
          <HiChevronDoubleDown
            onClick={() => {
              try {
                shiftToEnd();
              } catch (err) {}
            }}
            className="text-3xl cursor-pointer text-[#ffffffbc] mr-3"
          />

          {!isCurrentlyPlaying && (
            <MdClose onClick={removeSongFromQueue} className="text-2xl text-red-400 cursor-pointer" />
          )}
        </div>
      </div>
    </section>
  );
}
