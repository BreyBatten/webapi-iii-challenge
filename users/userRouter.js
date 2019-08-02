const express = require('express');

const Users = require("./userDb");
const Posts = require("../posts/postDb");

const router = express.Router();

router.use((req, res, next) => {
    console.log("user router");
    next();
});

router.post('/', validateUser, async (req, res) => {
    try {
        const user = await Users.insert(req.body);
        res.status(201).json(user);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error adding the user" });
    }
});

router.post('/:id/posts', validateUserId, validatePost, async (req, res) => {
    const postInfo = { ...req.body, user_id: req.params.id };

    try {
        const post = await Posts.insert(postInfo);
        res.status(201).json(post);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error getting the posts for the user" });
    }
});

router.get('/', async (req, res) => {
    try {
        const users = await Users.get(req.body);
        const messageOfTheDay = process.env.MOTD || "Hello World!";
        
        res.status(200).json(users);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error retrieving the user"});
    }
});

router.get('/:id', validateUserId, async (req, res) => {
    try {
        const user = await Users.getById(req.params.id);

        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error retrieving the user." });
    }
});

router.get('/:id/posts', validateUserId, async (req, res) => {
    try {
        const posts = await Users.getUserPosts(req.params.id);
        res.status(200).json(posts);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error getting the posts for the user" });
    }
});

router.delete('/:id', validateUserId, async (req, res) => {
    try {
        const count = await Users.remove(req.params.id);

        if (count > 0) {
            res.status(200).json({ message: "The user has been nuked" });
        } else {
            res.status(404).json({ message: "The user could not be found" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error removing the user" });
    }
});

router.put('/:id', validateUserId, validateUser, async (req, res) => {
    try {
        const user = await Users.update(req.params.id, req.body);

        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ message: "The user could not be found" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error updating the user" });
    }
});

//custom middleware

async function validateUserId(req, res, next) {
    try {
        const { id } = req.params;
        const user = await Users.getById(id);

        if (user) {
            req.user = user;
            next();
        } else {
            res.status(400).json({ message: "invalid user id" });
        }
    } catch (error) {
        res.status(500).json(error);
    }
};

function validateUser(req, res, next) {
    if (req.body && Object.keys(req.body).length) {
        if (req.body.name !== "") {
           next();
        } else {
            res.status(400).json({ message: "missing required name field"})
        }
    } else {
        res.status(400).json({ message: "missing user data" });
    }
};

function validatePost(req, res, next) {
    if (req.body && Object.keys(req.body).length) {
        if (req.body.text !== "") {
           next();
        } else {
            res.status(400).json({ message: "missing required text field"})
        }
    } else {
        res.status(400).json({ message: "missing post data" });
    }
};

module.exports = router;
