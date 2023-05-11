import HttpStatusCode from "../exceptions/HttpStatusCode.js";
import jwt from "jsonwebtoken";

export default function checkToken(req, res, next) {
  //bypass login, register, all harmless get function
  if (
    req.url.toLowerCase().trim() == "/users/login".toLowerCase().trim() ||
    req.url.toLowerCase().trim() == "/users/register".toLowerCase().trim() ||
    (req.url.toLowerCase().trim() == "/products".toLowerCase().trim() &&
      !req.query.searchString) ||
    (req.url.toLowerCase().trim().startsWith("/products") &&
      req.query.searchString)
  ) {
    next();
    return;
  }
  // other requests
  // get and validate token
  const token = req.headers?.authorization?.split(" ")[1];
  try {
    const jwtObject = jwt.verify(token, process.env.JWT_SECRET);
    const isExpired = Date.now() >= jwtObject.exp * 1000;
    if (isExpired) {
      res.result(HttpStatusCode.BAD_REQUEST).json({
        message: "Token is expired",
      });
      res.end();
    } else {
      next();
    }
  } catch (exception) {
    res.status(HttpStatusCode.BAD_REQUEST).json({
      message: exception.message,
    });
  }
}
