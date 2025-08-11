"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type ScheduledMessage = {
  _id: string;
  content: string;
  scheduledAt: number;
  status: string;
};

export default function Dashboard() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [userId, setUserId] = useState<string | null>(null);
  const [mode, setMode] = useState<"instant" | "schedule">("instant");
  const [channel, setChannel] = useState("C099P20QU78");
  const [text, setText] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [scheduledMessages, setScheduledMessages] = useState<ScheduledMessage[]>([]);

  // Get userId
  useEffect(() => {
    const uid = searchParams.get("userId");
    if (uid) {
      localStorage.setItem("slackUserId", uid);
      setUserId(uid);
    } else {
      const stored = localStorage.getItem("slackUserId");
      if (stored) setUserId(stored);
    }
  }, [searchParams]);

  // Fetch scheduled messages
  const fetchScheduled = async () => {
    if (!userId) return;
    try {
      const res = await fetch(`/api/get-scheduled-message?userId=${userId}`);
      if (!res.ok) throw new Error("Failed to fetch scheduled messages");
      const data = await res.json();
      setScheduledMessages(data.messages || []);
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    fetchScheduled();
    const interval = setInterval(fetchScheduled, 15000);
    return () => clearInterval(interval);
  }, [userId]);

  // Delete scheduled message
  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/delete-schedule-message`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();

      if (data.success) {
        toast.success("Message deleted");
        fetchScheduled();
      } else {
        toast.error(data.error || "Failed to delete message");
      }
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    }
  };

  const handleSubmit = async () => {
    if (!userId) {
      toast.error("Slack authorization missing. Please reconnect.");
      return;
    }
    if (!channel || !text) {
      toast.error("Channel and message are required.");
      return;
    }
    if (mode === "schedule" && (!date || !time)) {
      toast.error("Please provide both date and time.");
      return;
    }

    setLoading(true);

    const endpoint =
      mode === "instant"
        ? "/api/slack/send-messages"
        : "/api/slack/schedule-message";

    const payload: any = { userId, channel, text };
    if (mode === "schedule") {
      payload.date = date;
      payload.time = time;
    }

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        toast.success(mode === "instant" ? "Message sent!" : "Message scheduled!");
        setText("");
        if (mode === "schedule") {
          setDate("");
          setTime("");
        }
        fetchScheduled();
      } else {
        toast.error(data.error || "Failed to send message.");
      }
    } catch (err: any) {
      toast.error(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("slackUserId");
    router.push("/");
    toast.success("Logged out successfully.");
  };

  const formatTime = (timestamp: number) => {
    const dateObj = new Date(timestamp);
    return dateObj.toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex">
      {/* Form Section */}
      <div className="w-[75%] flex items-center justify-center p-6">
        <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-2xl">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
            Slack Message Dashboard
          </h2>

          {userId && (
            <p className="text-center text-sm text-gray-500 mb-6">
              Connected as: <span className="font-medium text-blue-600">{userId}</span>
            </p>
          )}
          {/* Mode Selector */}
          <div className="flex space-x-2 mb-6">
            <button
              className={`flex-1 py-2 rounded-lg ${mode === "instant" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"}`}
              onClick={() => setMode("instant")}
            >
              Instant Send
            </button>
            <button
              className={`flex-1 py-2 rounded-lg ${mode === "schedule" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"}`}
              onClick={() => setMode("schedule")}
            >
              Schedule
            </button>
          </div>

          {/* Inputs */}
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Channel ID"
              value={channel}
              readOnly
              className="w-full border border-gray-300 rounded-lg p-2 outline-none text-black"
            />
            <p className="text-red-500 -mt-3 text-xs">Default Channel Id</p>

            <input
              type="text"
              placeholder="Message"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 outline-none text-black"
            />

            {mode === "schedule" && (
              <>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2 outline-none text-black"
                />
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2 outline-none text-black"
                />
                <p className="text-sm text-red-500 -mt-3">Use 24-hour format*</p>
              </>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`w-full py-2 px-4 rounded-lg transition ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 hover:bg-green-600 text-white"}`}
            >
              {loading ? "Sending..." : mode === "instant" ? "Send Now" : "Schedule Message"}
            </button>

            <button
              onClick={handleLogout}
              className="mt-4 text-base rounded-lg px-5 py-2 bg-red-500 text-white hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Scheduled Messages Sidebar */}
      <div className="w-[25%] bg-white p-4 shadow-lg overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Scheduled</h3>
        {scheduledMessages.length > 0 ? (
          scheduledMessages.map((msg) => (
            <div key={msg._id} className="mb-3 border-b pb-2 flex flex-col gap-1">
              <p className="text-sm text-gray-700 truncate">{msg.content}</p>
              <p className="text-xs text-gray-500">{formatTime(msg.scheduledAt)}</p>
              <p
                className={`text-xs font-semibold ${msg.status === "pending"
                    ? "text-yellow-500"
                    : msg.status === "sent"
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
              >
                {msg.status}
              </p>
              <button
                onClick={() => handleDelete(msg._id)}
                className="text-xs text-white bg-red-500 hover:bg-red-600 px-2 py-1 rounded"
              >
                🗑 Delete
              </button>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500">No scheduled messages</p>
        )}
      </div>
    </div>
  );
}
