import HttpStatusCode from "../exceptions/HttpStatusCode.js";
import jwt from "jsonwebtoken";

export default function checkToken(req, res, next) {
  // Bypass login, register, harmless GET requests
  if (
    req.method === "GET" &&
    req.url.toLowerCase().trim().startsWith("/users")
  ) {
    next();
    return;
  }

  if (
    req.method === "POST" &&
    (req.url.toLowerCase().trim() === "/users/login" ||
      req.url.toLowerCase().trim() === "/users/register")
  ) {
    next();
    return;
  }

  // Other requests
  // Get and validate token
  const token = req.headers?.authorization?.split(" ")[1];
  try {
    if (!token) {
      throw new Error("Token not provided");
    }
    const jwtObject = jwt.verify(token, process.env.JWT_SECRET);
    const isExpired = Date.now() >= jwtObject.exp * 1000;
    if (isExpired) {
      res.status(HttpStatusCode.BAD_REQUEST).json({
        message: "Token is expired",
      });
    } else {
      next();
    }
  } catch (exception) {
    res.status(HttpStatusCode.BAD_REQUEST).json({
      message: exception.message,
    });
  }
}
