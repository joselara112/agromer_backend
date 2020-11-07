const jwt = require('jsonwebtoken');
require('dotenv').config();//dotenv configura jsonwebtoken con la secret key del archivo .env
const expressJwt = require('express-jwt');
const User = require('../models/user');


exports.signup = async (req, res) => {
    const userExists = await User.findOne({email: req.body.email});/**
    busca el email en la DB */
    if(userExists) return res.status(403).json({
        error: "Email is taken!"
    })
    const user = await new User(req.body);/**nueva instancia de User, 
    con los datos brindados por el req */
    await user.save();//salvar en la DB
    res.status(200).json({message: "signup success! Please login."});
};

exports.signin = (req, res) => {
    //find the user based on email
    const { email, password } = req.body;
    User.findOne({email}, (err, user) => {
        if(err || !user) {
            return res.status(401).json({
                error: "User with that email does not exist. Please signin."
            });
        }
        //if user is found make sure the email and password match
        //create authenticate method in model and use here
        if(!user.authenticate(password)) {
            return res.status(401).json({
                error: "Email and password do not match."
            });
        }
        //generate a token with user id and secret
        const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET);/**generate cookie */
        //persist the token as 't' in cookie to frontend client. 't' is the name of the cookie we create, and token is the value of the cookie
        res.cookie("t", token, {expire: new Date() + 9999});
        //return response with user and token to frontend client in case of server side rendering
        const {_id, name, email} = user;
        return res.json({token, user: {_id, email, name}});

    }); 
}

exports.signout = (req, res) => { /**to signout what we have to do is clear
    the cookie's token */
    res.clearCookie("t");
    return res.json({message: "Signout success"});

};
//requireSignin se usara como middleware en /routes/post.js
exports.requireSignin = expressJwt({
    /**if the token is valid, express jwt appends the verifed users id
     * in an auth key to the request object
     */
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"],
    userProperty: "auth"
});