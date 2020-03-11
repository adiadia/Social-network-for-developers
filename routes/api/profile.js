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
        const profile = await Profile.findOne({ user: req.user.id }).populate('users', ['name', 'avatar']);
        if (!profile) {
            return res.status(400).json({ msg: 'There is no profile for this user' });
        }

        return res.json(profile);
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
    const {
        company,
        website,
        location,
        bio,
        status,
        githubusername,
        skills,
        youtube,
        facebook,
        twitter,
        instagram,
        linkedin
    } = req.body;
    // Build Profile object
    const ProfileFields = {};
    ProfileFields.user = req.user.id;
    if (company) ProfileFields.company = company;
    if (website) ProfileFields.website = website;
    if (location) ProfileFields.location = location;
    if (bio) ProfileFields.bio = bio;
    if (status) ProfileFields.status = status;
    if (githubusername) ProfileFields.githubusername = githubusername;
    if (skills) {
        ProfileFields.skills = skills.split(',').map(skill => skill.trim());
    }
    ProfileFields.social = {}
    if (youtube) ProfileFields.social.youtube = youtube;
    if (facebook) ProfileFields.social.facebook = facebook;
    if (twitter) ProfileFields.social.twitter = twitter;
    if (instagram) ProfileFields.social.instagram = instagram;
    if (linkedin) ProfileFields.social.linkedin = linkedin;

    try {
        let profile = await Profile.findOne({ user: req.user.id });
        if (profile) {
            profile = await Profile.findOneAndUpdate(
                { user: req.user.id },
                { $set: ProfileFields },
                { new: true }
            );
            return res.json(profile);
        }

        // Create new Profile
        profile = new Profile(ProfileFields);
        await profile.save();
        res.json(profile);

    }
    catch (err) {

    }


});

module.exports = route;