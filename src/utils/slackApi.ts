import dbConnect from "@/db/db";
import { User } from "@/models/user.model";

export async function getValidAccessToken(userId: any){
  await dbConnect();
  const user = await User.findById(userId);

  if (!user || !user.slack?.access_token) {
    return null;
  }

  // Optional: check expiration here if needed

  return user.slack.access_token;
}
