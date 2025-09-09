import express from "express";
const router = express.Router();
import userController from "./controllers/user.controller";

router.get("/", userController.goHome);

router.get("/getLogin", userController.getLogin);

router.get("/getSignup", userController.getSignup);

router.post("/signup", userController.signup);

router.post("/login", userController.login);

router.post("/logout", userController.logout);

export default router;
