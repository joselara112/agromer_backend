const Post = require('../models/post');
const formidable = require('formidable');
const fs = require('fs');
const _ = require('lodash');


exports.postById = (req, res, next, id) => {/**id comes from routing */
    Post.findById(id)
        .populate("postedBy", "_id name")/**dentro de postedBy solo dame _id y name */
        .exec((err, post) => {
            if(err || !post) {
                return res.status(400).json({
                    error: err
                });
            }
            req.post = post;/**pega el post en el req */
            next();//postById es un middleware, por eso el next
        });
}


exports.getPosts = (req, res) => {
    // res.json({
    //     posts: [{title: 'hey jude...'}, {title: 'i will always love you'}]
    // });
    // console.log('get post');/**esto es el ejemplo sencillo para hacer un get de un post de ejemplo */
    const posts = Post.find()//el metodo find de mongoose es para encontrar todos los post de ese modelo de DB
        .populate("postedBy", "_id name email")//parecido a select pero aqui puedes navegar dentro del objeto
        .select("_id title body")//seleccionas los keys que quieres obtener del get
        .then(posts => {
            res.status(200).json({posts: posts});//devuelves la respesta del get que pide el cliennte
        })//se puede simplificar el codigo con res.json({posts})
        .catch(err => console.log(err));
};

exports.createPosts = (req, res) => {
    let form = new formidable.IncomingForm();/**formidable es una libreria
    para poder leer req con fotos y adaptarlas a la BD. this expression 
    expects to read data from postman or react in the form of "form-data",
    specifically x-www-form-urlenconded*/
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if(err) {
            return res.status(400).json({
                error: "Image could not be uploaded"
            });
        }
        let post = new Post(fields);
        req.profile.hashed_password = undefined;
        req.profile.salt = undefined;
        post.postedBy = req.profile;
        if(files.photo) {
            post.photo.data = fs.readFileSync(files.photo.path);
            post.photo.contentType = files.photo.type;
        }
        post.save((err, result) => {
            if(err) {
                return res.status(400).json({
                    error: err
                });
            }
            res.json(result);
        });
    }); 
    // const post = new Post(req.body);
    // // console.log(req);
    // console.log("CREATING POST: ", req.body);
    // post.save().then(result => {/**post.save salva el post en la DB */
    //     res.status(200).json({/**respuesta al browser que hizo el request */
    //         post: result
    //     });
    // });
    // post.save((err, result) => {
    //     if(err) {
    //         return res.status(400).json({
    //             error: err
    //         });
    //     }
    //     res.status(200).json({
    //         post: result
    //     });
    // });/**no es necesario manejar el error asi porque ya esta implementado el validator */
};

exports.postsByUser = (req, res) => {
    Post.find({postedBy: req.profile._id})
        .populate("postedBy", "_id name")
        .sort("_created")//sort by created property
        .exec((err, posts) => {
            if(err) {
                return res.status(400).json({
                    error: err
                });
            }
            res.json(posts);
        });
}

exports.isPoster = (req, res, next) => {
    // let isPoster = req.post && req.auth && req.post.postedBy._id === req.auth._id/**corrobora que el id del user que hace el req sea el mismo que el id del que hizo el post */
    let isPoster = req.post && req.auth && req.post.postedBy._id == req.auth._id/**en la linea de arriba tenemos la tercera condicion como "estrictamente igual" (===), vamos a dejar "loose equal" (==) */
    // console.log(req.post);
    // console.log(req.auth);
    // console.log(typeof req.post.postedBy._id);
    // console.log(typeof req.auth._id);
    if(!isPoster) {
        return res.status(403).json({
            error: "User is not authorized"
        });
    }
    next();//next function
};

exports.updatePost = (req, res, next) => {
    let post = req.post;
    post = _.extend(post, req.body);//actualiza el post
    post.updated = Date.now();//guarda la fecha de actualizacion
    post.save(err => {//salva el post en la DB
        if(err) {
            return res.status(400).json({
                error: err
            });
        }
        res.json(post);
    });
};


exports.deletePost = (req, res) => {
    let post = req.post;
    post.remove((err, post) => {/**remove es un method de mongoose */
        if(err) {
            return res.status(400).json({
                error: err
            });
        }
        res.json({
            message: "Post deleted successfully"
        });
    });
};