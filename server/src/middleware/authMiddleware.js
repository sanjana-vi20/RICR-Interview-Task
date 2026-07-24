import jwt from "jsonwebtoken";
import User from "../models/usermodel.js";

export const Protect = async (req, res, next) => {
  try {
    const token = req.cookies.ricrUser;
    console.log("token recieved in cookie", token);

    const tea = jwt.verify(token, process.env.JWT_SECRET);
    if (!tea) {
      const error = new Error("Unauthorized User");
      error.statusCode = 401;
      return next(error);
    }
    console.log(tea);

    const verifyUser = await User.findById(tea.id);
    if (!verifyUser) {
      const error = new Error("Unauthorized User");
      error.statusCode = 401;
      return next(error);
    }

    req.user = verifyUser;

    next();
  } catch (error) {
    next(error);
  }
};

export const AdminProtect = async (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      const error = new Error("Unauthorized! Only admin can do this");
      error.statusCode = 401;
      return next(error);
    }

    next();
  } catch (error) {
    next(error);
  }
};

export const TeacherProtect = async (req, res, next) => {
  try {
    if (req.user.role !== "teacher") {
      const error = new Error("Unauthorized! Only manager can do this");
      error.statusCode = 401;
      return next(error);
    }

    next();
  } catch (error) {
    next(error);
  }
};


