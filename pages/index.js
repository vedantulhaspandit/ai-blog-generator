import Link from "next/link";

import { Logo } from "../components/AppLayout/Logo";

export default function Home() {
  return (
    <div>
      <div className="w-screen h-screen overflow-hidden flex justify-center items-center relative bg-cyan-100">
        <div className="relative z-10 text-white px-10 py-5 text-center max-w-screen-sm bg-slate-900/90 rounded-md backdrop-blur-sm">
          <Logo />
          <p>
            Discover an AI-enabled SaaS platform that produces SEO-optimized
            blog posts in mere minutes. Enjoy high-quality content without
            wasting your time.
          </p>
          <Link href="/post/new" className="btn">
            Begin
          </Link>
        </div>
      </div>
    </div>
  );
}
