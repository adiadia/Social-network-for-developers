const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = async function (req, res, next) {

    // Get token form  header
    const token = await req.header('x-auth-token');

    if (!token) {
        return res.status(401).json({ msg: "No token, authorization denied" });
    }

    try {
        const decoded = jwt.verify(token, config.get('jwtSceret'));
        req.user = decoded.user;
        next();
    }
    catch (err) {
        res.status(401).json({ msg: "Token is not valid" })
    }
}