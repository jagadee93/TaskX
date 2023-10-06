const User = require("../model/userModel")
const asyncHandler = require("express-async-handler");
const userInfo = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.userId).select("-password -_id  -refreshToken").lean();
    if (!user) {
        res.status(401)
        throw new Error("user not found")
    }
    req.user = user
    next();
});

module.exports = {
    userInfo
}