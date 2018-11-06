const express = require('express')
const router = express.Router()
const passport = require("passport");
const Post = require('../../models/Post')

// @route   GET api/posts/test
// @desc    Tests post route
// @access  Public
router.get('/test', (req, res) => res.json({

    message: 'posts works'
}))

// @route   POST api/posts
// @desc    Create post
// @access  Private

router.post('/', passport.authenticate('jwt', {
    session: false
}), (req, res) => {

    const {errors, isValid} = validatePostInput(req.body)

    // Check Validation
    if(!isValid){
        // If any errors, send 400 with errors obj
        return res.status(400).json(errors)
    }

    // CREATE OBJECT POST
    const newPost = new Post({
        text: req.body.text,
        name: req.body.name,
        avatar: req.body.avatar,
        user: req.user.id
    })
    // SAVE POST
    newPost.save().then(post => res.json(post))
})

module.exports = router