import mongoose from "mongoose";

export interface IMessage extends Document{
    _id: mongoose.Types.ObjectId,
    sender_id: string,
    content: string,
    status: string,
    scheduledAt: Date | null,
    isScheduled: boolean
}

const messageSchema = new mongoose.Schema<IMessage>({
    content: {
        type: String,
        required: true
    },
    sender_id: {
        type: String
    },
    status: {
        type: String
    },
    scheduledAt: {
        type: Date || Number || null
    },
    isScheduled: {
        type: Boolean
    }
}, { timestamps: true })

export const Message = mongoose.models?.Message || mongoose.model("Message", messageSchema)