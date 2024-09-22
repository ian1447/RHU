import jwt from "jsonwebtoken";
import { User } from "../models/user.js";
import { Profile } from "../models/profile.js";

function createJWT(user) {
  return jwt.sign({ user: user._id }, process.env.SECRET, { expiresIn: "24h" });
}

async function login(req, res) {
  try {
    if (!process.env.SECRET) throw new Error("no SECRET in back-end .env");
    if (!process.env.CLOUDINARY_URL)
      throw new Error("no CLOUDINARY_URL in back-end .env");

    const user = await User.findOne({ email: req.body.email }).populate(
      "profile"
    );
    if (!user) throw new Error("User not found");

    const isMatch = await user.comparePassword(req.body.password);
    if (!isMatch) throw new Error("Incorrect password");

    const token = createJWT(user);

    // console.log("User data:", {
    //   id: user._id,
    //   displayName: user.profile.name,
    //   email: user.email,
    //   photo: user.profile.photo,
    //   role: user.role,
    //   name: user.firstname + " " + user.lastname,
    // });

    res.json({
      token,
      user: {
        id: user._id,
        displayName: user.profile.name,
        email: user.email,
        photo: user.profile.photo,
        role: user.role,
        name: user.firstname + " " + user.lastname,
      },
    });
  } catch (err) {
    handleAuthError(err, res);
  }
}

async function signup(req, res) {
  try {
    if (!process.env.SECRET) throw new Error("no SECRET in back-end .env");
    if (!process.env.CLOUDINARY_URL)
      throw new Error("no CLOUDINARY_URL in back-end .env");

    const user = new User(req.body);
    await user.save();
    const profile = new Profile({ user: user._id });
    await profile.save();

    const token = createJWT(user);
    res.json({
      token,
      user: {
        id: user._id,
        displayName: profile.name,
        email: user.email,
        photo: profile.photo,
      },
    });
  } catch (err) {
    handleAuthError(err, res);
  }
}

async function changePassword(req, res) {
  try {
    const user = await User.findById(req.user._id);
    const isMatch = await user.comparePassword(req.body.oldPassword);
    if (!isMatch) throw new Error("Incorrect old password");

    user.password = req.body.newPassword;
    await user.save();

    res.json({ message: "Password changed successfully" });
  } catch (err) {
    handleAuthError(err, res);
  }
}

function handleAuthError(err, res) {
  console.log(err);
  const { message } = err;
  if (
    message === "User not found" ||
    message === "Incorrect password" ||
    message === "Incorrect old password"
  ) {
    res.status(401).json({ err: message });
  } else {
    res.status(500).json({ err: message });
  }
}

export { signup, login, changePassword };
