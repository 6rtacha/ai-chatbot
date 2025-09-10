import { request, Response } from "express";
import CharacterService from "../models/Character.service";
import { CharacterInput } from "../libs/types/character";
import { AuthRequest } from "../libs/auth";
import { shapeIntoMongooseObjectId, T } from "../libs/types/common";
import { ExtendedRequest } from "../libs/types/user";
import Conversation from "../schema/Conversation.model";
const characterService = new CharacterService();

const characterController: T = {};
(characterController.createCharacter = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const input: CharacterInput = {
      characterName: req.body.characterName,
      characterPrompt: req.body.characterPrompt,
      characterImage: "",
    };

    console.log(" req.user.id", req.user);

    const character = await characterService.createCharacter(
      input,
      req.user._id,
      req.file
    );

    res.status(201).json(character);
  } catch (err: any) {
    console.error("Error, createCharacter:", err);
    res
      .status(400)
      .json({ error: err.message || "Failed to create character" });
  }
}),
  (characterController.getCharacters = async (
    req: ExtendedRequest,
    res: Response
  ) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Not authenticated" });
      }
      console.log("getCharacters");

      const characters = await characterService.getCharacters(req.user);
      res.status(200).json(characters);
    } catch (err: any) {
      console.error("Error, getCharacters:", err);
      res
        .status(500)
        .json({ error: err.message || "Failed to fetch characters" });
    }
  });

characterController.chat = async (req: ExtendedRequest, res: Response) => {
  try {
    console.log("req.body", req.body);
    //@ts-ignore
    const { characterId, message } = req.body;

    if (!characterId || !message) {
      return res
        .status(400)
        .json({ error: "Character ID and message are required" });
    }

    // Convert characterId to MongoDB ObjectId if needed
    const input = shapeIntoMongooseObjectId(characterId);

    const reply = await characterService.chat(input, message);

    res.status(200).json({ reply });
  } catch (err: any) {
    console.error("Error in sendMessage:", err);
    res.status(500).json({ error: err.message || "Failed to send message" });
  }
};

characterController.chat = async (req: ExtendedRequest, res: Response) => {
  try {
    //@ts-ignore
    const { characterId, message } = req.body;
    const userId = req.user?._id; // assuming you have auth middleware

    if (!characterId || !message) {
      return res
        .status(400)
        .json({ error: "Character ID and message required" });
    }

    const input = shapeIntoMongooseObjectId(characterId);

    // Find or create conversation
    let conversation = await Conversation.findOne({
      userId,
      characterId: input,
    });
    if (!conversation) {
      conversation = new Conversation({
        userId,
        characterId: input,
        messages: [],
      });
    }

    // Save user message
    conversation.messages.push({
      sender: "user",
      text: message,
      timestamp: new Date(),
    });

    // Get bot reply
    const reply = await characterService.chat(input, message);

    // Save bot message
    conversation.messages.push({
      sender: "bot",
      text: reply,
      timestamp: new Date(),
    });

    await conversation.save();

    res.status(200).json({ reply, conversation });
  } catch (err: any) {
    console.error("Error in chat:", err);
    res.status(500).json({ error: err.message || "Failed to chat" });
  }
};

characterController.getConversation = async (
  req: ExtendedRequest,
  res: Response
) => {
  try {
    //@ts-ignore
    const { characterId } = req.params;
    const userId = req.user?._id;

    const conversation = await Conversation.findOne({
      userId,
      characterId,
    }).populate("characterId", "characterName characterImage");
    console.log("conversation", conversation);
    console.log("userId", userId);
    console.log("characterId", characterId);

    if (!conversation) {
      return res.status(200).json({ messages: [] });
    }

    res.status(200).json({ messages: conversation.messages });
  } catch (err: any) {
    console.error("Error in getConversation:", err);
    res
      .status(500)
      .json({ error: err.message || "Failed to fetch conversation" });
  }
};

export default characterController;
