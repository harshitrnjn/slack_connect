import mongoose from "mongoose";

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  username: string;
  email: string;
  password: string;
  profile_pic: string;
  slack: object;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    profile_pic: {
      type: String,
    },
    slack: {
      id: {
        type: String,
        unique: true
      },
      workspace_id: String,
      access_token: String,
      refresh_token: String,
      expires_at: Number,
    },
  },
  { timestamps: true }
);

export const User =
  mongoose.models?.User || mongoose.model<IUser>("User", userSchema);
