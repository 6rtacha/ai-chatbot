import { NextFunction, Request, Response } from "express";
import { T } from "../libs/types/common";
import UserService from "../models/User.service";
import { ExtendedRequest, User, UserInput } from "../libs/types/user";
import AuthService from "../models/Auth.service";
import jwt from "jsonwebtoken";

const userService = new UserService();
const authService = new AuthService();

const userController: T = {};
userController.goHome = (req: Request, res: Response) => {
  try {
    res.send("homepage");
  } catch (error) {
    console.log("Error", error);
  }
};

userController.signup = async (req: Request, res: Response) => {
  try {
    const newUser: UserInput = req.body;
    console.log("body:", req.body);
    const result: User = await userService.signup(newUser);
    const token = await authService.createToken(result);
    res.send(result);
  } catch (error) {
    console.log("Error", error);
  }
};

userController.login = async (req: Request, res: Response) => {
  try {
    console.log("body:", req.body);
    const input = req.body;
    const userService = new UserService();
    const result = await userService.login(input);
    const token = await authService.createToken(result);

    res.cookie("accessToken", token, {
      maxAge: 1 * 3600 * 1000,
      httpOnly: false,
    });

    res.status(200).json({ user: result, accessToken: token });
  } catch (error) {
    console.log("Error", error);
  }
};

userController.logout = async (req: Request, res: Response) => {
  try {
    console.log("logout");
    res.cookie("accessToken", null, { maxAge: 0, httpOnly: true });
    res.status(200).json({ logout: true });
  } catch (err) {
    console.log("Error, logout: ", err);
  }
};

userController.getLogin = (req: Request, res: Response) => {
  try {
    res.send("login page");
  } catch (error) {
    console.log("Error", error);
  }
};

userController.getSignup = (req: Request, res: Response) => {
  try {
    res.send("signup page");
  } catch (error) {
    console.log("Error", error);
  }
};

export default userController;
