import bcrypt from "bcrypt";

import jwt from "jsonwebtoken";

export const hashpassword = async(password)=>
    {
       const salt = await bcrypt.genSalt(10);
       const hashedpassword = await bcrypt.hash(password,salt);
       return hashedpassword;
    }

export const comparepassword = async(password,hashed)=>
    {
    return await bcrypt.compare(password,hashed);
    }

    
export const generatejwt = (userid)=>{
    return jwt.sign({id:userid},process.env.JWT,{expiresIn:"30m"});
}