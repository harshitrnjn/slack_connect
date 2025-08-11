"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [userId, setUserId] = useState<string | null>(null);

   const SLACK_AUTH_URL = `https://slack.com/oauth/v2/authorize?client_id=${process.env.NEXT_PUBLIC_SLACK_CLIENT_ID}&scope=chat:write,channels:read,groups:read,im:write,users:read,users:read.email&redirect_uri=${encodeURIComponent(`${process.env.NEXT_PUBLIC_NGROK_URL}/api/auth/slack`)}`;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const uid = params.get("userId");
    if (uid) {
      localStorage.setItem("slackUserId", uid);
      setUserId(uid);
      params.delete("userId");
      window.history.replaceState({}, "", `${window.location.pathname}`);
    } else {
      const storedId = localStorage.getItem("slackUserId");
      if (storedId) setUserId(storedId);
    }
  }, []);

  return (
     <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-red-400 flex flex-col items-center justify-center text-white px-4 transition-all duration-500">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center drop-shadow-lg">
          “Communication works for those who work at it.”
        </h1>
        <p className="text-lg md:text-xl mb-12 italic text-center max-w-2xl">
          — John Powell
        </p>

        {!userId ? (
          <a
            href={SLACK_AUTH_URL}
            className="bg-white text-purple-700 hover:text-white hover:bg-purple-700 px-8 py-3 rounded-full text-lg font-semibold transition-all shadow-lg"
          >
            Connect to Slack
          </a>
        ) : (
          <>
            <p className="mt-8 text-white text-md text-center">
              You're already connected. 🎉
            </p>
            <Link
              href="/dashboard"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full mt-6 transition-all"
            >
              Continue to Dashboard
            </Link>
          </>
        )}
      </div>
  );
}
