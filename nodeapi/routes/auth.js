const express = require('express');
const { signup, signin, signout } = require('../controllers/auth');
const { userById } = require('../controllers/user');
const {userSignupValidator} = require('../validator/index');

const router = express.Router();

router.post('/signup', userSignupValidator, signup);/**before the controller (signup)
we write the middleware (userSignupValidator) */

router.post('/signin', signin);

router.get('/signout', signout);//we can use get method because we are not adding any data to the app

//any route containing :userId, our app first will execute userById()
router.param("userId", userById);/**cada vez que se encuentre el parametro "userId" en el route, se va a ejecutar el method userById */

module.exports = router;