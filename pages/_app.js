import { UserProvider } from "@auth0/nextjs-auth0/client";
import { Noto_Sans, Noto_Serif_Display } from "next/font/google";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";

import { PostsProvider } from "../context/postsContext";
import "../styles/globals.css";
config.autoAddCss = false; // prevent flashing 

const notoSans = Noto_Sans({
  weight: ["400", "500", "700"],
  subsets: ["cyrillic-ext"],
  variable: "--font-noto-sans",
});

const notoSerifDisplay = Noto_Serif_Display({
  weight: ["400"],
  subsets: ["cyrillic-ext"],
  variable: "--font-noto-serif",
});

function MyApp({ Component, pageProps }) {
  const getLayout = Component.getLayout || ((page) => page);
  return (
    <UserProvider>
      <PostsProvider>
        <main
          className={`${notoSans.variable} ${notoSerifDisplay.variable} font-body`}
        >
          {getLayout(<Component {...pageProps} />, pageProps)}
        </main>
      </PostsProvider>
    </UserProvider>
  );
}

export default MyApp;
