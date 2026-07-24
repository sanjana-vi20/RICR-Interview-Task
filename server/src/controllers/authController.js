import User from "../models/usermodel.js";
import bcrypt from 'bcrypt'
import { genToken } from "../util/authToken.js";

export const UserLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      const error = new Error("All Fields are Required");
      error.statusCode = 400;
      return next(error);
    }

     const existingUser = await User.findOne({ email });
    if (!existingUser) {
      const error = new Error("Email not Registered");
      error.statusCode = 401;
      return next(error);
    }

    const isVerified = await bcrypt.compare(password, existingUser.password);
    if (!isVerified) {
      const error = new Error("Wrong Password");
      error.statusCode = 401;
      return next(error);
    }

    await genToken(existingUser, res);

    res.status(200).json({ message: "Login Successfully", data: existingUser });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
