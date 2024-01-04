import { User } from "../models/index.js";
import Exception from "../exceptions/Exception.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const login = async ({ email, password }) => {
  // print("login user in user repository, hahaha", OutputType.INFORMATION);
  let existingUser = await User.findOne({ email }).exec();
  if (existingUser) {
    //not encrypt password
    let isMatch = await bcrypt.compare(password, existingUser.password);
    if (!!isMatch) {
      //create Javascript Web Token (JWT)
      let token = jwt.sign(
        {
          data: existingUser,
        },
        process.env.JWT_SECRET,
        {
          // expiresIn: '60' //1min
          expiresIn: "1d",
        }
      );
      // clone and add more properties
      return {
        ...existingUser.toObject(),
        password: "Not showed",
        token: token,
      };
    } else {
      throw new Exception(Exception.WRONG_EMAIL_OR_PASSWORD);
    }
  } else {
    throw new Exception(Exception.WRONG_EMAIL_OR_PASSWORD);
  }
};

const register = async ({ name, email, password, imgUrl, balance }) => {
  // validation already done
  debugger;
  let existingUser = await User.findOne({ email }).exec();
  if (!!existingUser) {
    throw new Exception(Exception.USER_EXIST);
  }
  // use for login
  // encrypt password, using bcrypt
  // const isMatched = await bcrypt.compare(password, existingUser.password);
  // if (isMatched) {

  // }
  const hashedPassword = await bcrypt.hash(
    password,
    parseInt(process.env.SALT_ROUNDS)
  );
  // insert to db
  const newUser = await User.create({
    name,
    email,
    password: hashedPassword,
    imgUrl,
    balance,
  });
  return {
    ...newUser._doc,
    password: "Not showed",
  };
};

export default {
  login,
  register,
};
