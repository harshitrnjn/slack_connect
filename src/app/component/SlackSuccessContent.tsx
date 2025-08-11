"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";

export default function SlackSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const userId = searchParams.get("userId");
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`/api/user/${userId}`);
        setUsername(res.data.username || "Slack User");
      } catch (err) {
        console.error("Failed to load user:", err);
        setUsername("Slack User");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500 text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-500 to-indigo-600 px-4">
      <div className="bg-white p-8 rounded-xl shadow-xl max-w-md text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Welcome, {username} 🎉
        </h1>
        <p className="text-gray-600 mb-6">
          You've successfully signed in with Slack.
        </p>

        <button
          onClick={() =>
            router.push(
              `/dashboard?userId=${userId}&channelId=${process.env.SLACK_CHANNEL_ID}`
            )
          }
          className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition"
        >
          Continue to Dashboard
        </button>

        <p className="text-sm text-gray-400 mt-4">User ID: {userId}</p>
      </div>
    </div>
  );
}
