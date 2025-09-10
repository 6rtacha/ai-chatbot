import { User } from "../libs/types/user";
import { Character, CharacterInput } from "../libs/types/character";
import CharacterModel from "../schema/Character.model";
import { shapeIntoMongooseObjectId } from "../libs/types/common";
import { getAIResponse } from "../libs/openai";
import { ObjectId } from "mongoose";

class CharacterService {
  private readonly characterModel;

  constructor() {
    this.characterModel = CharacterModel;
  }

  public async createCharacter(
    input: CharacterInput,
    userId: string,
    file?: Express.Multer.File
  ): Promise<Character> {
    try {
      const characterData = {
        characterName: input.characterName,
        characterPrompt: input.characterPrompt,
        characterImage: file ? `/uploads/${file.filename}` : "",
        userId: userId,
      };
      console.log("characterData", characterData);

      const result = await this.characterModel.create(characterData);

      return {
        _id: result._id.toString(),
        characterName: result.characterName,
        characterPrompt: result.characterPrompt,
        characterImage: result.characterImage,
        userId: result.userId.toString(),
      };
    } catch (err) {
      console.error("Error, createCharacter:", err);
      throw new Error("Failed to create character");
    }
  }

  public async getCharacters(user: User): Promise<Character[]> {
    try {
      const userId = shapeIntoMongooseObjectId(user._id);
      const results = await this.characterModel
        .find({
          $or: [{ isDefault: true }, { userId }],
        })
        .sort({ isDefault: -1, characterName: 1 });
      console.log("results", results);

      return results;
    } catch (err) {
      console.error("Error, getCharacters:", err);
      throw new Error("Failed to fetch characters");
    }
  }

  public async chat(characterId: string, message: string) {
    const character = await this.characterModel.findById(characterId);
    if (!character) {
      throw new Error("Character not found");
    }

    const prompt = `
      ${character.characterPrompt}
      You are ${character.characterName}.
      Stay in character at all times.
      
      User: ${message}
      ${character.characterName}:
    `;

    // Get AI response
    const aiResponse = await getAIResponse(prompt);

    return aiResponse;
  }
}

export default CharacterService;
