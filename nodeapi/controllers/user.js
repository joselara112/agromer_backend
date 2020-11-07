const User = require('../models/user');
const _ = require('lodash');


exports.userById = (req, res, next, id) => {
    User.findById(id).exec((err, user) => {/*findById is a mongoose method,
        then exec() uses that output as an argument for the next arrow function*/
        if(err || !user) {
            return res.status(400).json({
                error: "User not found"
            });
        }
        req.profile = user; //adds profile object in request with user info
        next();//next middleware
    })
}

exports.hasAuthorization = (req, res, next) => {
    const authorized = req.profile && req.auth && req.profile._id === req.auth._id
    if(!authorized) {
        return res.status(403).json({
            error: "User is not authorized to perform this action"
        });
    }
};

exports.allUsers = (req, res) => {
    User.find((err, users) => {/**find method es un method de mongoose */
        if(err) {
            return res.status(400).json({
                error: err
            });
        }
        res.json({ users });
    }).select("name email updated created");/**select method es de mongoose */
};

exports.getUser = (req, res) => {
    req.profile.hashed_password = undefined;
    req.profile.salt = undefined;//esto para borrar del res esos datos sensibles
    return res.json(req.profile);
};

exports.updateUser = (req, res, next) => {
    let user = req.profile;
    user = _.extend(user, req.body); /*mutate the source object "user"
    se usa para hacer llamados "put" y actualizar datos del user
    en el body debe estar los campos que se quieren actualizar*/
    user.updated = Date.now();
    user.save((err) => {
        if(err) {
            return res.json(400).json({
                error: "You are not authorized to perform this action"
            })
        }
        user.hashed_password = undefined;
        user.salt = undefined;
        res.json({ user })
    })
}

exports.deleteUser = (req, res, next) => {
    let user = req.profile;
    user.remove((err,user) => {
        if(err) {
            return res.status(400).json({
                error: err
            });
        }
        res.json({ message: "User deleted successfully" });
    });
}