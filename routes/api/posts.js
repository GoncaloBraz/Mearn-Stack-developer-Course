const express = require('express')
const router = express.Router()
const passport = require("passport");

// Post Model
const Post = require('../../models/Post')
// Profile Model
const Profile = require('../../models/Profile')

// Validation
const validatePostInput = require('../../validation/post')

// @route   GET api/posts/test
// @desc    Tests post route
// @access  Public
router.get('/test', (req, res) => res.json({

    message: 'posts works'
}))

// @route   GET api/posts
// @desc    GET posts
// @access  Public

router.get('/', (req, res) => {
    Post.find()
        .sort({
            date: -1
        })
        .then(posts => res.json(posts))
        .catch(err => res.status(404).json({
            nopostsfound: 'no posts found'
        }))
})

// @route   GET api/posts/:id
// @desc    GET posts by id
// @access  Public

router.get('/:id', (req, res) => {
    Post.findById(req.params.id)
        .then(post => res.json(post))
        .catch(err => res.status(404).json({
            nopostfound: 'no post found with that id'
        }))
})

// @route   POST api/posts
// @desc    Create post
// @access  Private

router.post('/', passport.authenticate('jwt', {
    session: false
}), (req, res) => {

    const {
        errors,
        isValid
    } = validatePostInput(req.body)

    // Check Validation
    if (!isValid) {
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

// @route   DELETE api/posts/:id
// @desc    DELETE post
// @access  Private
router.delete('/:id', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    Profile.findOne({
            user: req.user.id
        })
        .then(profile => {
            Post.findById(req.params.id)
                .then(post => {
                    // Check for owner post
                    if (post.user.toString() !== req.user.id) {
                        return res.status(401).json({
                            notauthorized: 'User not authorized'
                        })
                    }

                    // DELETE POST
                    post.remove()
                        .then(() => res.json({
                            success: true
                        }))
                })
                .catch(err => res.status(404).json({
                    postnotfound: 'No post found'
                }))
        })
})

module.exports = router