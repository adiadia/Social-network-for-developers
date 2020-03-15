const express = require('express');
const route = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
const Post = require('../../models/Post');
const User = require('../../models/User');
const Profile = require('../../models/Profile');

// @route  Post api/posts
// @desc   Create a Post
// @access Private
route.post('/', [auth, [
    check('text', 'Text is required').not().isEmpty()
]], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const user = await User.findById(req.user.id).select('-password');
        const newPost = {
            text: req.body.text,
            name: req.body.name,
            avatar: user.avatar,
            user: req.user.id
        }
        post = new Post(newPost);
        await post.save();
        res.json(post);

    } catch (err) {
        console.log(err.message);
        req.status(500).send('Server Error');
    }

});

// @route  Post api/posts
// @desc   Get all Posts
// @access Private

route.get('/', auth, async (req, res) => {

    try {
        const posts = await Post.find().sort({ date: -1 });
        res.json(posts);
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server Error');
    }

});

// @route  Post api/posts/:id
// @desc   Get Post by id
// @access Private

route.get('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        console.log(post);
        if (!post) {
            return res.status(400).json({ msg: 'Post not found' });
        }
        res.json(post);
    } catch (err) {
        console.log(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(400).json({ msg: 'Post not found' });
        }
        res.status(500).send('Server Error');
    }

});


// @route  Delete api/posts/:id
// @desc   Delete Post by id
// @access Private

route.delete('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(400).json({ msg: 'Post not found' });
        }
        if (post.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User is not authorized' });
        }
        await post.remove();
        return res.json({ msg: 'Post removed' });
    } catch (err) {
        console.log(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(400).json({ msg: 'Post not found' });
        }
        res.status(500).send('Server Error');
    }

});

// @route  Put api/posts/like/:id
// @desc   Like a post
// @access Private

route.put('/like/:id', auth, async (req, res) => {
    try {

        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(400).json({ msg: 'Post not found' });
        }
        if (post.likes.filter(like => String(like.users) === String(req.user.id)).length > 0) {
            return res.status(400).json({ msg: 'Post is already liked' });
        }
        post.likes.unshift({ users: req.user.id });
        await post.save();
        return res.json(post.likes);
    } catch (err) {
        console.log(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(400).json({ msg: 'Post not found' });
        }
        res.status(500).send('Server Error');

    }
});
// @route  Put api/posts/unlike/:id
// @desc   Like a post
// @access Private

route.put('/unlike/:id', auth, async (req, res) => {
    try {

        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(400).json({ msg: 'Post not found' });
        }
        if (post.likes.filter(like => String(like.users) === String(req.user.id)).length == 0) {
            return res.status(400).json({ msg: 'Post is already liked' });
        }
        const removeLike = post.likes.map(item => item.users).indexOf(req.user.id);
        post.likes.splice(removeLike, 1);
        await post.save();
        return res.json(post.likes);
    } catch (err) {
        console.log(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(400).json({ msg: 'Post not found' });
        }
        res.status(500).send('Server Error');

    }
});

// @route  Post api/posts/comment/:id
// @desc   Comment a post
// @access Private

route.post('/comment/:id', [auth, [
    check('text', 'Text is required').not().isEmpty(),
]], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const user = await User.findById(req.user.id).select('-password');
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(400).json({ msg: 'Post not found' });
        }
        const newComment = {
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id
        }
        post.comments.unshift(newComment);
        await post.save();
        return res.json(post.comments);
    } catch (err) {
        console.log(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(400).json({ msg: 'Post not found' });
        }
        res.status(500).send('Server Error');

    }
});
// @route  Put api/posts/comment/:id/:comment_id
// @desc   Delete a comment
// @access Private

route.delete('/comment/:id/:comment_id', auth, async (req, res) => {
    try {

        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(400).json({ msg: 'Post not found' });
        }
        const comment = post.comments.find(comment => comment.id === req.params.comment_id);
        // Make comment exits
        if (!comment) {
            return res.status(400).json({ msg: "Comment don't exist" });
        }
        // Check User
        if (String(comment.user) !== String(req.user.id)) {
            return res.status(401).json({ msg: "User is not authorized" });
        }
        const removeComment = post.comments.map(item => item.users).indexOf(req.user.id);
        post.comments.splice(removeComment, 1);
        await post.save();
        return res.json(post.comments);

    } catch (err) {
        console.log(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(400).json({ msg: 'Post not found' });
        }
        res.status(500).send('Server Error');

    }
});


module.exports = route;