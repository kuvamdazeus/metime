import { GetServerSideProps, NextApiRequest } from "next";
import { useEffect } from "react";
import { IoPlay } from "react-icons/io5";
import AlbumPoster from "../../components/AlbumPoster";
import Player from "../../components/Player";
import { IArtist } from "../../types/songs";
import { getArtistData } from "../../utils/api/dataFetching";
import validateUser from "../../utils/api/validateUser";

interface Props {
  artist: IArtist;
}

export default function ArtistPage({ artist }: Props) {
  return (
    <>
      <section className="relative h-screen bg-[#242424]">
        <header className="relative h-[400px]">
          <img
            src={artist.image}
            className="
              absolute top-0 left-0 w-full h-full object-cover object-center opacity-75
            "
          />
          <section
            className="
              absolute -bottom-20 w-full h-56 bg-gradient-to-b
              from-transparent via-[#242424] to-[#242424]
            "
          />

          <section className="absolute w-full h-full flex flex-col justify-between">
            <div />
            <p className="text-[64px] tracking-[0.05rem] text-white font-extrabold mx-10">{artist.name}</p>
            <div />
          </section>
        </header>

        {/* Albums go here */}
        <section className="absolute bottom-32 w-full flex items-center overflow-x-scroll">
          {artist.albums.map((album) => (
            <AlbumPoster album={album} />
          ))}
        </section>
      </section>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ query, req }) => {
  const user_id = validateUser(req as NextApiRequest);
  if (!user_id) return { props: {}, redirect: { destination: "/" } };

  const artistId = query.id;
  try {
    const data = await getArtistData(req.cookies.token, artistId as string);
    return { props: { artist: data } };

    //
  } catch (err) {
    console.log("ERROR while getting artist data", err);
    return { props: {}, redirect: { destination: "/" } };
  }
};
