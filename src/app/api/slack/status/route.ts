import dbConnect from '@/db/db';
import { User } from '@/models/user.model';
import type { NextApiRequest, NextApiResponse } from 'next';


export default async function GET(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();
  const { userId } = req.query; // replace with session userId
  const user = await User.findById(userId);

  res.json({ connected: !!user?.slack?.access_token });
}
