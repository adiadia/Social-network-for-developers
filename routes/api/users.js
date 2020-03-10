const express = require('express');
const route = express.Router();
const { check, validationResult } = require('express-validator/check');
const User = require('../../models/User');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');

// @route  Post api/users
// @desc   Test route
// @access Public
route.post('/', [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Email must correct formate').isEmail(),
    check('password', 'Password must be minimum 6 character').isLength({ min: 6 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { name, email, password } = req.body;
    try {

        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ errors: [{ msg: "User is already exits" }] });
        }
        const avatar = gravatar.url(email, {
            s: '200',
            r: 'pg',
            d: 'mm'
        });
        user = new User({
            name,
            email,
            avatar,
            password
        });
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();
        res.send("user req");
    }
    catch (err) {
        console.log(err.message);
        res.status(500).send('Server error');
    }

});

module.exports = route;