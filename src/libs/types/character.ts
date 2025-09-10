import { ObjectId } from "mongoose";
import { User } from "./user";
export interface CharacterInput {
  characterName: string;
  characterPrompt: string;
  characterImage?: string;
  userId?: string;
}

export interface Character {
  _id: ObjectId;
  characterName: string;
  characterPrompt: string;
  characterImage?: string;
  userId: ObjectId;
}

export interface ChatInput {
  characterId: string;
  message: string;
}
