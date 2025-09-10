// models/Conversation.model.ts
import mongoose, { Schema, Document } from "mongoose";

interface IMessage {
  sender: "user" | "bot";
  text: string;
  timestamp: Date;
}

export interface IConversation extends Document {
  userId: mongoose.Types.ObjectId;
  characterId: mongoose.Types.ObjectId;
  messages: IMessage[];
}

const MessageSchema = new Schema<IMessage>({
  sender: { type: String, enum: ["user", "bot"], required: true },
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const ConversationSchema = new Schema<IConversation>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  characterId: {
    type: Schema.Types.ObjectId,
    ref: "Character",
    required: true,
  },
  messages: [MessageSchema],
});

export default mongoose.model<IConversation>(
  "Conversation",
  ConversationSchema
);
