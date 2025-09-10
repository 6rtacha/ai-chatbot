import express from "express";
const router = express.Router();
import userController from "./controllers/user.controller";
import characterController from "./controllers/character.controller";
import makeUploader from "./libs/uploader";
import { authMiddleware } from "./libs/auth";

const characterUploader = makeUploader("character");

router.get("/", userController.goHome);

router.get("/getLogin", userController.getLogin);

router.get("/getSignup", userController.getSignup);

router.get("/getCharacters", authMiddleware, characterController.getCharacters);

router.post("/signup", userController.signup);

router.post("/login", userController.login);

router.post("/logout", userController.logout);

router.post(
  "/createCharacter",
  authMiddleware,
  characterUploader.single("characterImage"),
  characterController.createCharacter
);

router.post("/chat", authMiddleware, characterController.chat);

router.get(
  "/conversation/:characterId",
  authMiddleware,
  characterController.getConversation
);

export default router;
