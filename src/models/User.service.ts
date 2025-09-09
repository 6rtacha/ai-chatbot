import { User, UserInput } from "../libs/types/user";
import UserModel from "../schema/User.model";
import * as bcrypt from "bcryptjs";

class UserService {
  private readonly userModel;
  constructor() {
    this.userModel = UserModel;
  }

  public async signup(input: UserInput): Promise<User> {
    const salt = await bcrypt.genSalt();
    input.userPassword = await bcrypt.hash(input.userPassword, salt);

    try {
      const result = await this.userModel.create(input);
      result.userPassword = "";
      return result.toJSON();
    } catch (error) {
      console.log("Error on signup", error);
      throw new Error("Username is taken");
    }
  }

  public async login(input: User): Promise<User> {
    //TODO: Consider member status later
    const user = await this.userModel
      .findOne(
        {
          userName: input.userName,
        },
        { userName: 1, userPassword: 1 }
      )
      .exec();
    if (!user) throw new Error("use not found");

    const isMatch = await bcrypt.compare(input.userPassword, user.userPassword);
    if (!isMatch) throw new Error("Wrong password!");

    return await this.userModel.findById(user._id).lean().exec();
  }
}

export default UserService;
