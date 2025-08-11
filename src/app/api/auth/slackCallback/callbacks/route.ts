
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import dbConnect from '@/db/db';
import { User } from '@/models/user.model';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  const userId = searchParams.get('userId');

  if (!code || !userId) {
    return NextResponse.json({ error: 'Missing code or userId' }, { status: 400 });
  }

  await dbConnect();

  try {
    const response = await axios.post(
      'https://slack.com/api/oauth.v2.access',
      null,
      {
        params: {
          client_id: process.env.SLACK_CLIENT_ID,
          client_secret: process.env.SLACK_CLIENT_SECRET,
          code,
          redirect_uri: process.env.SLACK_REDIRECT_URI
        }
      }
    );

    const { access_token, refresh_token, expires_in, team } = response.data;

    await User.findByIdAndUpdate(userId, {
      'slack.workspace_id': team.id,
      'slack.access_token': access_token,
      'slack.refresh_token': refresh_token,
      'slack.expires_at': Date.now() + expires_in * 1000
    });

    return NextResponse.redirect(`${process.env.FRONTEND_URL}/success`);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'OAuth error' }, { status: 500 });
  }
}
