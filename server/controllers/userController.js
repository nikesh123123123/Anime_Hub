import User from "../models/User.js";
import { hashpassword, comparepassword, generatejwt } from "../utils/hashing.js";


export const registerUser = async (req, res, next) => {
    try {
       
        let { username, emailid, password } = req.body; 

      
        if (!username || !emailid || !password) {
            res.status(400);
            throw new Error("Please fill all fields (Username, Email, and Password)");
        }

  
        const existEmail = await User.findOne({ emailid });
        if (existEmail) {
            res.status(409);
            throw new Error("Email ID is already taken");
        }

      
        const existUsername = await User.findOne({ username });
        if (existUsername) {
            res.status(409);
            throw new Error("This username is already taken. Please choose another one.");
        }

      
        const hashed = await hashpassword(password);
        const newuser = await User.create({ 
            username, 
            emailid, 
            password: hashed 
        });

        res.status(201).json({
            id: newuser._id,
            username: newuser.username,
            emailid: newuser.emailid,
            role: newuser.role,
            message: "Registered successfully"
        });
    } catch (err) {
        next(err);
    }
}




export const loginuser = async (req, res, next) => {
    try {
      
        const { identity, password } = req.body;

        if (!identity || !password) {
            res.status(400);
            throw new Error("Please provide your username/email and password");
        }

      
        const userexist = await User.findOne({
            $or: [{ emailid: identity }, { username: identity }]
        });

       
        if (!userexist || !(await comparepassword(password, userexist.password))) {
            res.status(400);
            throw new Error("Invalid credentials");
        }

       
        const token = generatejwt(userexist._id);
        res.status(200).json({
            message: "Login successful",
            token,
            user: { 
                id: userexist._id, 
                username: userexist.username,
                email: userexist.emailid, 
                role: userexist.role 
            }
        });
    } catch (err) {
        next(err);
    }
}