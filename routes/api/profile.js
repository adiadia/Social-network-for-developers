const express = require('express');
const route = express.Router();
const Profile = require('../../models/Profile');
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator/check');

// @route  GET api/profile/me
// @desc   Get current login user profile
// @access Private
route.get('/me', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id });
        if (!profile) {
            return res.status(400).json({ msg: 'There is no profile for this user' });
        }
        return res.json(profile.populated('user', ['name', 'avatar']));
    }
    catch (err) {
        console.log(err.message);
        res.status(500).send('Server error');
    }
});

// @route  POST api/profile/profile
// @desc   Create or update User profile
// @access Private

route.post('/profile', [auth, [
    check('status', 'Status is required').not().isEmpty(),
    check('skills', 'Skill is required').not().isEmpty(),
]], async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
});

module.exports = route;