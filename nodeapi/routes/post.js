const express = require('express');
const { 
    createPosts, 
    getPosts, 
    postsByUser, 
    postById, 
    isPoster, 
    deletePost,
    updatePost 
} = require('../controllers/post');
const { requireSignin } = require('../controllers/auth');
const { userById } = require('../controllers/user');
const { createPostValidator } = require('../validator/index');

const router = express.Router();


router.get('/posts', getPosts);/*se usa el middleware de requireSignin 
para que sea unicamente los loggeados los que puedas pedir GETs*/
// router.post('/post/new/:userId', requireSignin, createPostValidator, createPosts);
/**la linea de arriba ocasionaba un error en controllers/post, porque createPostValidator
 * entraba antes de culminar de parse el req por formidable. La linea de abajo 
 * se invierte la posicion de createPostValidator y createPosts, y ahora si
*/
router.post('/post/new/:userId', requireSignin, createPosts, createPostValidator);
router.get('/posts/by/:userId', requireSignin, postsByUser);
router.put('/post/:postId', requireSignin, isPoster, updatePost)
router.delete('/post/:postId', requireSignin, isPoster, deletePost);

//any route containing :userId, our app will first execute userById()
router.param("userId", userById);
router.param("postId", postById);

module.exports = router;