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
  userName: string;
  userPassword: string;
  userImage?: string;
}

export interface ExtendedRequest extends Request {
  user?: User;
  file?: Express.Multer.File;
  cookies: Record<string, string>;
}
