import User from "../Models/User.js";
import { hashPassword, comparePassword} from "../Models/User.js";
import jwt from "jsonwebtoken";

export const Register = async (req, res) => {
    const {name, email, phoneNumber, password, role} = req.body;
    try{
        if(!name || !email || !phoneNumber || !password || !role){
            return res.status(400).json({success: false, message: "All fields are required"});
        }
        const user = await User.findOne({email});
        // Checking if the user exists 
        if(user){
            return res.status(400).json({success: false, message: "User already exists"});
        }
        // Creating new user 
        // waiting for the password to be encrypted
        else{
            const newUser = await User.create({name, email, phoneNumber, password: await hashPassword(password), role});
            // Creating a token and sending info like userID and role 
            const token = jwt.sign({
                id: newUser._id,
                role: newUser.role
            }, process.env.JWT_SECRET, {
                expiresIn: "7d"
            })
            // Sending token to the client as cookie
            // Evey time any request is made after logging in or signing in the cookie is automatically sent from the client to the server
            res.cookie("token", token, {
                httpOnly: true, 
                secure: process.env.NODE_ENV == "production", // The cookie is only sent over HTTPS on local hoast it fails sending cookie
                sameSite: "strict",
                maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
            })
            // Sending mail for creating a new account with us

            return res.status(201).json({success: true, message: "User created successfully", user: newUser});
        }
    }
    catch(error){
        return res.status(500).json({success: false, message: error.message});
    }
}

export const Login = async (req, res) => {
    const {email, password} = req.body;
    try{
        // Role is not necessary as it is already stored in the database
        if(!email || !password){
            return res.status(400).json({success: false, message: "All fields are required"});
        }
        // Check if the email and password exists in the database 
        const user = await User.findOne({email}).select("+password");
        // Checking if the user does not exists 
        if(!user){
            return res.status(400).json({success: false, message: "User not found"});
        }
        // Checking if the password is correct
        if(!await comparePassword(password, user.password)){
            return res.status(400).json({success: false, message: "Invalid password"});
        }
        // Creating a token and sending info like userID and role 
        const token = jwt.sign({
            id: user._id,
            role: user.role
        }, process.env.JWT_SECRET, {
            expiresIn: "7d"
        })
        // Sending token to the client as cookie
        // Evey time any request is made after logging in or signing in the cookie is automatically sent from the client to the server
        res.cookie("token", token, {
            httpOnly: true, 
            secure: process.env.NODE_ENV == "production", // The cookie is only sent over HTTPS on local hoast it fails sending cookie
            sameSite: "strict",
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
        })

        return res.status(200).json({success: true, message: "User logged in successfully"});
    }
    catch(error){
        return res.status(500).json({success: false, message: error.message});
    }
}

export const Logout = async (req, res) => {
    try{
        res.clearCookie("token", {
            httpOnly: true, 
            secure: process.env.NODE_ENV == "production", // The cookie is only sent over HTTPS on local hoast it fails sending cookie
            sameSite: "strict",
        })
        return res.status(200).json({success: true, message: "User logged out successfully"});
    }
    catch(error){
        return res.status(500).json({success: false, message: error.message});
    }
}



