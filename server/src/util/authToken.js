import jwt from "jsonwebtoken";

export const genToken = async (user, res) => {
  try {
    const payload = {
      id: user._id,
      role: user.role || "admin",
    };
    const token = await jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    console.log(token);
    res.cookie("ricrUser", token, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
  } catch (error) {
    throw error;
  }
};

export const genOTPToken = async (user, res) => {
  try {
    const payload = {
      id: user._id,
      role: user.role,
    };
    const token = await jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "10m",
    });

    console.log(token);
    res.cookie("otpToken", token, {
      maxAge: 1000 * 60 * 10,
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });
  } catch (error) {
    throw error;
  }
};
