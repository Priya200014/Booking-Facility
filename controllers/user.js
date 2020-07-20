const crypto = require('crypto');
const UserData = require("../models/userdatabase");
const nodemailer = require('nodemailer');
const sendgrid = require('nodemailer-sendgrid-transport');
const bcrypt = require('bcryptjs');
const {
    validationResult
} = require('express-validator')

const transport = nodemailer.createTransport(sendgrid({
    auth: {
        api_key: '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'
    }
}));

exports.loginsuccess = (req, res, next) => {

    let errors = validationResult(req);

    if (!errors.isEmpty()) {

        console.log(errors.array());
        return res.status(422).render('userlog.ejs', {

            path: '/user/signup',
            docTitle: "Bus Booking",
            subTitle: "Login",
            errorMessage: errors.array()[0]
        });
    }

    UserData.fetchByName(req.body.email)
        .then(result => {

            console.log(result);
            if (result) {

                bcrypt.compare(req.body.pass, result.pass).then(hashcode => {

                    if (hashcode) {
                        req.session.isAgent = false;
                        req.session.isLoggedIn = true;
                        req.session.user = result;
                        req.session.save(err => {

                            console.log(err);
                        })

                        return res.redirect(302, '/home');
                    } else
                        return res.render("userlog.ejs", {
                            errorMessage: {
                                msg: "Invalid Email or Password"
                            }
                        });

                }).catch(err => {

                    console.log(err);
                    return res.render("userlog.ejs", {
                        errorMessage: {
                            msg: "Invalid Email or Password"
                        }
                    });
                });
            } else
                return PromiseRejectionEvent();

        })
        .catch(() => {

            return res.render("userlog.ejs", {
                errorMessage: {
                    msg: "Invalid Email or Password"
                }
            });
        });
}

exports.signupsuccess = (req, res, next) => {

    let email = req.body.email;

    let errors = validationResult(req);

    if (!errors.isEmpty()) {

        console.log(errors.array());
        return res.status(422).render('usersignup.ejs', {

            path: '/user/signup',
            docTitle: "Bus Booking",
            subTitle: "Sign up",
            errorMessage: errors.array()[0]
        });
    }

    if (req.body.pass != req.body.re_pass) {

        req.flash('error', "Password not matching");
        return res.status(302).redirect(302, "/user/signup");
    }

    UserData.fetchByName(email).then(users => {

            if (users) {

                req.flash('error', "Email already exist");
                return res.redirect('/user/signup');
            } else
                return bcrypt.hash(req.body.pass, 12);

        }).then(hash => {

            const userdata = new UserData(req.body.uname, hash, req.body.email);
            userdata.save();
            console.log("Created");
            res.redirect("/user/login");
            return transport.sendMail({
                to: req.body.email,
                from: 'balajisr2021@srishakthi.ac.in',
                subject: 'Bus Booking Signup Successfull',
                html: '<h1>Welcome To Bus Ticket</h1>'
            });
        })
        .catch(err => console.log(err));

}

exports.dashboard = (req, res, next) => {
    UserData.fetchByName(req.session.user.email).then(result => {

        req.session.user = result;
        res.render("userdashboard.ejs", {
            tickets: result.tickets
        });
    }).catch(err => console.log(err));
}