
import jwt from "jsonwebtoken";
import User from "../models/User.js";


export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer")) {
      res.status(401);
      throw new Error("Not authorized, no token");
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT);
console.log("Token Issued At:", new Date(decoded.iat * 1000).toLocaleTimeString());
console.log("Token Expires At:", new Date(decoded.exp * 1000).toLocaleTimeString());
console.log("Current Time:", new Date().toLocaleTimeString());
const secondsLeft = Math.round(decoded.exp - (Date.now() / 1000));
console.log(`Token lives for another: ${secondsLeft} seconds`);

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      res.status(401);
      throw new Error("User not found");
    }

    req.user = user;
    next(); 
  } catch (err) {
    res.status(401);
    next(new Error("Invalid token")); 
  }
};


export const adminOnly = (req, res, next) => {
  try {
    if (!req.user) {
      res.status(401);
      throw new Error("Not authorized");
    }

    if (req.user.role !== "admin") {
      res.status(403);
      throw new Error("Access denied: Admins only");
    }

    next(); 
  } catch (err) {
    next(err); 
  }
};
