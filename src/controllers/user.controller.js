import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { apiResponse } from "../utils/ApiResponse.js";


const registerUser = asyncHandler(async (req, res) => {
    // Get user details from frontend / postman
    // Validation - not empty 
    // Check if user already exist:username, emaail
    // Check for images, check for avatar
    // Upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // if created return responnse / if not return user not created

    const { username, email, fullname, password } = req.body
    console.log(email, "email");

    if ([fullname.email, username, password].some((field) => field?.trim() === "")) {
        throw new apiError(400, "All firlds are required")
    }
    //..........................................................................

    const existedUser = User.findOne({
        $or: [{ username }, { email }]
    })

    if (existedUser) {
        throw new apiError(409, "User with email or username is already exists")
    }
    //............................................................................

    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverimage[0]?.path

    if (!avatarLocalPath) {
        throw new apiError(400, "Avatar file is requied")
    }
    //............................................................................

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!avatar) {
        throw new apiError(400, "Avatar file is requied")
    }
    //.............................................................................

    const user = await User.create({
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new apiError(500, "somthing went wrong wile registering a user")
    }
    //.........................................................................

    return res.status(201).json(
        new apiResponse(200, createdUser, "user registered successfully")
    )

})



export { registerUser }