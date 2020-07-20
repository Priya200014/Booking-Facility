const exp = require("express");
const path = require("path");
const rootDir = require("../utils/path");
const controller = require('../controllers/user');
const {
    check
} = require('express-validator');
const userRouter = exp.Router();
const isAuth = require('../middleware/is_auth');
const isNotAuth = require('../middleware/is_not_auth');

userRouter.get("/login", isNotAuth, (req, res, next) => {

    let message = req.flash('error');

    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }

    // res.setHeader('set-cookie','loggedIn=true; HttpOnly');
    // console.log(req.get('Cookie'));
    res.render("userlog.ejs", {
        errorMessage: message
    });
});

userRouter.post("/logout", isAuth, (req, res, next) => {

    req.session.isAgent = false;
    req.session.isLoggedIn = false;
    req.session.user = null;
    req.session.destroy((err) => {

        console.log(err);
        res.redirect(301, '/user/login');
    })
});

userRouter.get("/signup", isNotAuth, (req, res, next) => {

    let message = req.flash('error');

    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }

    console.log(req.session);
    res.render("usersign.ejs", {
        errorMessage: message
    })
});

userRouter.post("/loginsuccess", isNotAuth, check('email').isEmail().withMessage('Please enter valid email'), controller.loginsuccess);
userRouter.post("/signupsuccess", isNotAuth, check('email').isEmail().withMessage('Please enter valid email'), controller.signupsuccess);
userRouter.get('/dashboard', isAuth, controller.dashboard);
module.exports = userRouter;