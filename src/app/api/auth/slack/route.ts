import dbConnect from "@/db/db";
import { User } from "@/models/user.model";
import axios from "axios";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  if (!code) {
    return new Response(JSON.stringify({ error: "Missing code" }), {
      status: 400,
    });
  }

  const redirectUri = `${process.env.NEXT_PUBLIC_NGROK_URL}/api/auth/slack`;

  try {
    // Step 1: Exchange code for token
    const tokenResponse = await axios.post(
      "https://slack.com/api/oauth.v2.access",
      new URLSearchParams({
        code,
        client_id: process.env.NEXT_PUBLIC_SLACK_CLIENT_ID!,
        client_secret: process.env.SLACK_CLIENT_SECRET!,
        redirect_uri: redirectUri,
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    const data = tokenResponse.data;
    if (!data.ok) {
      return new Response(
        JSON.stringify({ error: "Slack OAuth failed", details: data }),
        { status: 400 }
      );
    }

    // Step 2: Fetch user info using the bot token (xoxb-...)
    const profileRes = await axios.get(
      `https://slack.com/api/users.info?user=${data.authed_user.id}`,
      {
        headers: {
          Authorization: `Bearer ${data.access_token}`, // Use bot token
        },
      }
    );

    if (!profileRes.data.ok) {
      return new Response(
        JSON.stringify({
          error: "Failed to fetch Slack profile",
          details: profileRes.data,
        }),
        { status: 400 }
      );
    }

    const slackUser = profileRes.data.user;

    // Step 3: Save or update user in DB
    await dbConnect();

    let user = await User.findOne({
      $or: [
        { email: slackUser.profile.email },
        { "slack.id": slackUser.id },
      ],
    });

    if (user) {
      // User exists — update tokens
      user.slack = {
        id: slackUser.id,
        access_token: data.access_token,
        refresh_token: data.refresh_token || null,
        expires_at: Date.now() + (data.expires_in ? data.expires_in * 1000 : 0),
      };

      await user.save();
    } else {
      // New user — create
      user = await User.create({
        username: slackUser.real_name || slackUser.name || "Slack User",
        email: slackUser.profile.email || "",
        password: "defaultpassword", // Temp: replace with secure random password
        slack: {
          id: slackUser.id,
          access_token: data.access_token,
          refresh_token: data.refresh_token || null,
          expires_at: Date.now() + (data.expires_in ? data.expires_in * 1000 : 0),
        },
      });
    }

    // Step 4: Redirect to frontend with userId
    return Response.redirect(
      `${process.env.NEXT_PUBLIC_NGROK_URL}/success?userId=${user._id}`
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({
        error: "OAuth process failed",
        details: err.response?.data || err.message,
      }),
      { status: 500 }
    );
  }
}
