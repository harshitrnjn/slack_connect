import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import dbConnect from '@/db/db';
import { User } from '@/models/user.model';

export default async function GET(req: NextApiRequest, res: NextApiResponse) {
  const { code, userId } = req.query; 
  await dbConnect();

  try {
    const response = await axios.post('https://slack.com/api/oauth.v2.access', null, {
      params: {
        client_id: process.env.SLACK_CLIENT_ID,
        client_secret: process.env.SLACK_CLIENT_SECRET,
        code,
        redirect_uri: process.env.SLACK_REDIRECT_URI
      }
    });

    const { access_token, refresh_token, expires_in, team } = response.data;

    await User.findByIdAndUpdate(userId, {
      'slack.workspace_id': team.id,
      'slack.access_token': access_token,
      'slack.refresh_token': refresh_token,
      'slack.expires_at': Date.now() + expires_in * 1000
    });

    res.redirect('/success');
  } catch (error) {
    console.error(error);
    res.status(500).send("OAuth error");
  }
}
