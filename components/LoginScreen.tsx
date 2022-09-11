import { useEffect, useState } from "react";
import { FaSpotify } from "react-icons/fa";

export default function LoginScreen({ authCodeUri }: { authCodeUri: string }) {
  const [isPhone, setIsPhone] = useState(false);

  useEffect(() => {
    if (window.screen.width <= 1000) setIsPhone(true);
  }, []);

  return (
    <section className="bg-[#272727] min-h-screen flex justify-center items-center">
      {!isPhone && (
        <a
          className="
          px-5 py-3 rounded-lg transition duration-300 transform shadow-xl
          hover:shadow-[#000000a8] bg-white text-xl text-black font-bold
          flex items-center
        "
          href={authCodeUri}
        >
          <p className="mr-1.5">Login With</p>
          <FaSpotify className="text-3xl text-green-500 bg-black rounded-full" />
        </a>
      )}

      {isPhone && (
        <p className="text-white text-center">
          This web app is made for bigger screens (desktop, laptop, tablet, etc.)
          <br />
          Please switch to a bigger screen :)
        </p>
      )}
    </section>
  );
}
