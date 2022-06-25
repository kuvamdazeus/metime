import type { AppProps } from "next/app";
import { RecoilRoot } from "recoil";
import AuthProvider from "../components/AuthProvider";
import Player from "../components/Player";
import ToastHandler from "../components/ToastHandler";
import "../index.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <section className="relative">
      <RecoilRoot>
        <AuthProvider>
          <>
            <Component {...pageProps} />
            <Player />
          </>
        </AuthProvider>
        <ToastHandler />
      </RecoilRoot>
    </section>
  );
}

export default MyApp;
