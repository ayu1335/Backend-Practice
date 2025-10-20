import {UserModel} from '../model/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
const JWT_SECRET_KEY="ayush";

export const sighup=async(req,res)=>{
     try{
        const {username,password}=req.body;
        // 1. Check username or pasword entered
        if(!username || !password){
            return res.status(401).send({error:" username and password required."})
        }
        // 2. Check user exist
         const existingUser = await UserModel.findOne({ username });
        if (existingUser) {
          return res.status(409).json({ error: "Username already taken." });
        }
    
        // 3. Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
    
        // 4. Create user
        await UserModel.create({
          username,
          password: hashedPassword
        });
    
        return res.status(201).json({ message: "User registered successfully!" });
        }
        catch{err}{
            return res.status(201).send({error:"error"});
        }
}


export const signin=async(req,res)=>{
    try{
            const {username,password}=req.body;
             if(!username || !password){
            return res.status(401).send({error:" username and password required."})
             }
            const user=await UserModel.findOne({username:username});
            if(!user){
                return res.status(401).send({error:"invalid username or password"})
            }
            const isValid = await bcrypt.compare(password, user.password);
            if(!isValid){
                return res.status(401).send({error:"invalid username or password"})
            }
            const token=jwt.sign({username:username},JWT_SECRET_KEY,{expiresIn:"1d"})
            return res.status(201).send({token:token});
        }
        catch(err){
            return res.status(401).send({erroe:"erroe"})
        }
}

