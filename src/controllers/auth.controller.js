// signup a new user
import User from "../models/user.schema.js"
import asyncHandler from "../service/asyncHandler";
import CustomError from "../utils/CustomError";

export const cookieOptions = {
    expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    httpOnly: true
}

export const signUp = asyncHandler(async(req, res) => {
    //get data from user
    const {name, email, password } = req.body

    //validation
    if (!name || !email || !password) {
        throw new CustomError("PLease add all fields", 400)
        // throw new Error("Got an error") - We are using customError
    }

    //lets add this data to database

    //check if user already exists
    const existingUser = await User.findOne({email})

    if (existingUser) {
        throw new CustomError("User already exists", 400)
    }

    const user = await User.create({
        name,
        email,
        password
    })

    const token = user.getJWTtoken()
    //safety
    user.password = undefined

    //store this token in user's cookie
    res.cookie("token", token, cookieOptions)

    // send back a response to user
    res.status(200).json({
        success: true,
        token,
        user,
    })


})
