import User from "../models/usermodel.js";

export const GetAllTeachers = async (req, res, next) => {
  try {
    const teachers = await User.find({
      role: "teacher",
      isActive: true,
    });
    console.log("Response : ", teachers);

    res.status(200).json({ message: "fetched Successfully", data: teachers });
  } catch (error) {
    next(error);
  }
};
