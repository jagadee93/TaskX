const jwt = require('jsonwebtoken');

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader?.startsWith('Bearer ')) return res.sendStatus(401);
    const token = authHeader.split(' ')[1];
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {

            if (err) return res.sendStatus(403);
            //invalid token
            //setting the request with the user and roles data
            req.userId = decoded.UserInfo.id;

            //we can use the information from req.userId

            next();
        }
    );
}

module.exports = verifyJWT