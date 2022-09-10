import { GetServerSideProps, NextApiRequest } from "next";
import Player from "../../components/Player";
import Song from "../../components/Song";
import { IAlbum } from "../../types/songs";
import { getAlbumData } from "../../utils/api/dataFetching";
import validateUser from "../../utils/api/validateUser";

interface Props {
  album: IAlbum;
}

export default function AlbumPage({ album }: Props) {
  return (
    <>
      <section className="pb-24 relative min-h-screen bg-[#242424]">
        <header className="relative h-[350px]">
          <img
            src={album.image}
            className="
            absolute top-0 left-0 w-full h-full object-cover object-center opacity-75
            filter blur-[50px]
          "
          />

          <section className="absolute w-full h-full flex flex-col justify-between">
            <div />
            <section className="flex items-center px-10">
              <div className="border-[0.1rem] border-[#ffffff81] rounded">
                <img src={album.image} className="w-56 rounded object-contain" />
              </div>
              <div>
                {console.log(album.artists)}
                <p className="text-xs font-light tracking-[0.1rem] text-gray-100 mx-10">
                  {album.type.toUpperCase()}
                </p>
                <p className="text-[44px] tracking-[0.05rem] text-white font-extrabold mx-10">{album.name}</p>
                <p className="text-xs font-bold tracking-[0.1rem] text-gray-100 mx-10">
                  <span>{album.artists.join(", ")}</span>
                  {" · "}
                  <span className="font-bold tracking-[0.05rem]">{album.release_date.split("-").at(0)}</span>
                  {" · "}
                  <span className="font-bold tracking-[0.05rem]">
                    {album.tracks.length} {album.tracks.length > 1 ? "SONGS" : "SONG"}
                  </span>
                </p>
              </div>
            </section>
            <div />
          </section>
        </header>

        {/* Albums go here */}
        <section className="text-white">
          {album.tracks.map((track) => (
            <Song song={track} group={album.tracks} />
          ))}
        </section>
      </section>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ query, req }) => {
  const user_id = validateUser(req as NextApiRequest);
  if (!user_id) return { props: {}, redirect: { destination: "/" } };

  const albumId = query.id;
  try {
    const data = await getAlbumData(req.cookies.token, albumId as string);
    return { props: { album: data } };

    //
  } catch (err) {
    console.log("ERROR while getting album data", err);
    return { props: {}, redirect: { destination: "/" } };
  }
};
