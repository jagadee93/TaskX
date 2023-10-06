
//when updating make sure that don't use lean method
const crypto = require("node:crypto")
const User = require("../model/userModel");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");



//register user
const createUser = asyncHandler(async (req, res) => {

    const { email, name, password } = req.body;

    if (!email || !password || !name) {
        res.status(400)
        throw new Error("please fill all the fields")
    }
    if (password.length < 6) {
        res.status(400)
        throw new Error("password must be at least 6 characters")
    }

    const ExistedUser = await User.findOne({ email }).lean().exec()

    if (ExistedUser) {
        res.status(409) //conflict 
        throw new Error("user already exists")
    }



    // const salt = await bcrypt.genSalt(10)
    // const hashedPassword = await bcrypt.hash(password, salt)
    const user = await User.create({
        username: name,
        email,
        password,
    })

    if (user) {
        const { _id, username, email } = user;
        res.status(201).json({
            status: 'success',
            data: {
                _id, username, email
            }
        })
    } else {
        res.status(400)
        throw new Error("invalid user data")
    }
});

//login user






const loginUser = asyncHandler(async (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ 'message': 'Username and password are required.' });
    }


    const foundUser = await User.findOne({ email }).exec();
    if (!foundUser) return res.sendStatus(401); //Unauthorized 
    // evaluate password 
    const isPasswordCorrect = await bcrypt.compare(password, foundUser.password);
    if (isPasswordCorrect && foundUser) {



        const accessToken = jwt.sign(
            {
                "UserInfo": {
                    "id": foundUser._id,
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '15m' }
        );


        const refreshToken = jwt.sign(
            { "userId": foundUser.id },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        );

        // Saving refreshToken with current user
        foundUser.refreshToken = refreshToken;
        const result = await foundUser.save();
        // Creates Secure Cookie with refresh token
        res.cookie('jwt', refreshToken, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 });
        // Send authorization roles and access token to user
        res.json({ accessToken, id: foundUser._id, });

    } else {
        res.status(401);
        throw new Error("invalid email or  password");
    }
});


const logoutUser = asyncHandler(async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204); //No content
    const refreshToken = cookies.jwt;
    // Is refreshToken in db?
    const foundUser = await User.findOne({ refreshToken }).exec();
    if (!foundUser) {
        res.clearCookie('jwt', { httpOnly: true, maxAge: 0, sameSite: 'None' }); //add secure in production
        return res.sendStatus(204);
    }

    // Delete refreshToken in db
    foundUser.refreshToken = '';
    const result = await foundUser.save();
    res.clearCookie('jwt', { httpOnly: true, maxAge: 0, sameSite: 'None' });
    res.status(204).json({ message: "success fully logged out " });
});


const getUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.userId).select("-password").lean();
    if (user) {
        const { _id, name, email } = user;
        res.status(201).json({
            status: 'success',
            data: {
                _id, name, email,
            }
        })
    } else {
        res.status(400)
        throw new Error("user not found")
    }

})


const loginStatus = asyncHandler(async (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        return res.json(false)
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET)
    if (verified) {
        return res.json(true)
    }
    return res.json(false)
});




const changePassword = asyncHandler(async (req, res) => {
    const { password, newpassword } = req.body;
    //validating
    if (!password || !newpassword) {
        res.status(400)
        throw new Error("please add old password and new password ")
    }
    const user = await User.findById(req.user._id).select("password")

    if (user) {
        const isPassWordCorrect = await bcrypt.compare(password, user.password)
        if (isPassWordCorrect) {
            user.password = newpassword;
            user.save();
            res.status(200).json({ message: "password successfully updated" })
        }
        res.status(400)
        throw new Error("invalid old password")
    }

    res.status(400)
    throw new Error("invalid user")
});


const deleteUser = asyncHandler(async (req, res) => {
    res.send("user delete Route")
});





const getAllUsers = async (req, res) => {
    const users = await User.find().select('-password -refreshToken').lean();
    if (!users) return res.status(204).json({ 'message': 'No users found' });

    res.json(users);
}




module.exports = {
    getAllUsers,
    createUser,
    loginUser,
    logoutUser,
    getUser,
    loginStatus,
    changePassword,
    deleteUser
}


