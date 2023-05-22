import { body, validationResult } from "express-validator";
import HttpStatusCode from "../exceptions/HttpStatusCode.js";
import { userRepository } from "../repositories/index.js";

const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(HttpStatusCode.BAD_REQUEST)
      .json({ errors: errors.array() });
  }
  const { email, password } = req.body;

  // Call repository
  try {
    let existingUser = await userRepository.login({ email, password });

    res.status(HttpStatusCode.OK).json({
      message: "Login user successfully",
      data: existingUser
    });
  } catch (exception) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      message: exception.toString(),
    });
  }
};

const register = async (req, res) => {
  // destructuring
  const { name, email, password, phoneNumber, address } = req.body;

  try {
    debugger;
    const user = await userRepository.register({
      name,
      email,
      password,
      phoneNumber,
      address,
    });
    res.status(HttpStatusCode.INSERT_OK).json({
      message: "Register user successfully",
      data: user,
    });
  } catch (exception) {
    debugger;
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      message: exception.toString(),
    });
  }
};

export default {
  login,
  register,
};
