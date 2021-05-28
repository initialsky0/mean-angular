const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/check-auth');
const setMulter = require('../middleware/setMulter');
const postsController = require('../controller/posts');



// posts path and methods, { storage: storage }
router.post('', checkAuth, setMulter, postsController.createPost);

router.get('', postsController.fetchPosts);

router.get('/:id', postsController.fetchPostById);

router.patch('/:id', checkAuth, setMulter, postsController.editPost);

router.delete('/:id', checkAuth, postsController.deletePost);

module.exports = router;

