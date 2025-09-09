import { ObjectId } from "mongoose";

export interface User {
  _id: ObjectId;
  userName: string;
  userPassword: string;
  userImage?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserInput {
  _id: ObjectId;
  userName: string;
  userPassword: string;
  userImage?: string;
}
