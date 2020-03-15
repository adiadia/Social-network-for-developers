const express = require('express');
const route = express.Router();
const Profile = require('../../models/Profile');
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator/check');


// @route  GET api/profile/user/:user_id
// @desc   Get User profile
// @access Public

route.get('/user/:user_id', async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.params.user_id }).populate('user', ['name', 'avatar']);
        if (!profile) return res.status(400).json({ msg: 'Profile not found' });
        return res.json(profile);
    } catch (err) {
        console.error(err.message);
        if (err.kind == 'ObjectId') {
            return res.status(400).json({ msg: 'Profile not found' });
        }
        res.status(500).send("Server Error");
    }
});

// @route  GET api/profile
// @desc   Get Users profile
// @access Public

route.get('/', async (req, res) => {
    try {
        const profiles = await Profile.find().populate('user', ['name', 'avatar']);
        return res.json(profiles);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});


// @route  GET api/profile/me
// @desc   Get current login user profile
// @access Private
route.get('/me', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id }).populate('user', ['name', 'avatar']);
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


// @route  Delete api/profile
// @desc   Delete User profile
// @access Private

route.delete('/', auth, async (req, res) => {
    try {
        // @Remove user post
        // @Remove user profile
        await Profile.findOneAndRemove({ user: req.user.id });
        // @Remove user
        await User.findOneAndRemove({ _id: req.user.id });
        return res.json({ msg: 'User deleted' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// @route  Put api/profile/experience
// @desc   Add profile experience
// @access Private

route.put('/experience', [auth, [
    check('title', 'Title is required').not().isEmpty(),
    check('company', 'Company is required').not().isEmpty(),
    check('from', 'From date is required').not().isEmpty(),
]], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ error: errors.array() });
    }
    const {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    } = req.body;
    const newExp = {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    }
    try {
        const profile = await Profile.findOne({ user: req.user.id });
        profile.experience.unshift(newExp);
        await profile.save();
        res.json(profile);

    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server Error');
    }
});

// @route  Delete api/profile/experience/:exp_id
// @desc   Delete profile experience
// @access Private
route.delete('/experience/:exp_id', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id });

        // Get remove index
        const removeIndex = profile.experience.map(item => item.id).indexOf(req.param.exp_id);
        profile.experience.splice(removeIndex, 1);
        await profile.save();
        return res.json(profile);

    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server Error');
    }

});



// @route  Put api/profile/eduction
// @desc   Add profile eduction
// @access Private

route.put('/eduction', [auth, [
    check('school', 'School is required').not().isEmpty(),
    check('degree', 'Degree is required').not().isEmpty(),
    check('fielofstudy', 'Field of study is required').not().isEmpty(),
    check('from', 'From date is required').not().isEmpty(),
]], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ error: errors.array() });
    }
    const {
        school,
        degree,
        fielofstudy,
        from,
        to,
        current,
        description
    } = req.body;
    const newEdu = {
        school,
        degree,
        fielofstudy,
        from,
        to,
        current,
        description
    }
    try {
        const profile = await Profile.findOne({ user: req.user.id });
        profile.education.unshift(newEdu);
        await profile.save();
        res.json(profile);

    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server Error');
    }
});

// @route  Delete api/profile/education/:edu_id
// @desc   Delete profile education
// @access Private
route.delete('/education/:edu_id', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id });

        // Get remove index
        const removeIndex = profile.education.map(item => item.id).indexOf(req.param.edu_id);
        profile.education.splice(removeIndex, 1);
        await profile.save();
        return res.json(profile);

    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server Error');
    }

});



module.exports = route;