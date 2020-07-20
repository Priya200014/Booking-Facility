const crypto = require('crypto');
const AgentData = require("../models/agentdatabase");
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
        return res.status(422).render('agent.ejs', {

            path: '/agent/login',
            docTitle: "Bus Booking",
            subTitle: "Login",
            errorMessage: errors.array()[0]
        });
    }

    AgentData.fetchByName(req.body.email)
        .then(result => {

            console.log(result);
            if (result) {

                bcrypt.compare(req.body.pass, result.pass).then(hashcode => {

                        if (hashcode) {
                            return new Promise(function (resolve, reject) {
                                req.session.isAgent = true;
                                req.session.isLoggedIn = false;
                                req.session.user = result;
                                return resolve(req.session.save(err => console.log(err)))
                            });
                        } else
                            return res.render("agentlog.ejs", {
                                errorMessage: {
                                    msg: "Invalid Email or Password"
                                }
                            });

                    }).then(() => res.render("agentdashboard.ejs"))
                    .catch(err => {

                        console.log(err);
                        return res.render("agnetlog.ejs", {
                            errorMessage: {
                                msg: "Invalid Email or Password"
                            }
                        });
                    });
            } else
                return PromiseRejectionEvent();

        })
        .catch(() => {

            return res.render("agnetlog.ejs", {
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

            path: '/agent/signup',
            docTitle: "Bus Booking",
            subTitle: "Sign up",
            errorMessage: errors.array()[0]
        });
    }

    if (req.body.pass != req.body.re_pass) {

        req.flash('error', "Password not matching");
        return res.status(302).redirect(302, "/agent/signup");
    }

    AgentData.fetchByName(email).then(users => {

            if (users) {

                req.flash('error', "Email already exist");
                return res.redirect(302, '/agent/signup');
            } else
                return bcrypt.hash(req.body.pass, 12);

        }).then(hash => {

            const userdata = new AgentData(req.body.uname, hash, req.body.email);
            userdata.save();
            console.log("Created");
            res.redirect("/agent/login");
            return transport.sendMail({
                to: req.body.email,
                from: 'balajisr2021@srishakthi.ac.in',
                subject: 'Bus Booking Signup Successfull',
                html: '<h1>Welcome To Bus Ticket</h1><h2>Now your are out agent</h2>'
            });
        })
        .catch(err => console.log(err));

}

exports.dashboard = (req, res, next) => {

    res.render("agentdashboard.ejs");
}

exports.busdetails = (req, res, next) => {

    AgentData.fetchByName(req.session.user.email).then(result => {

        req.session.isAgent = true;
        req.session.isLoggedIn = false;
        req.session.user = result;
        req.session.save(err => {

            console.log(err);
        })
        console.log(result.bus);
        res.render("agentbus.ejs", {
            bus: result.bus
        });
    }).catch();
}

exports.addbus = (req, res, next) => {


    let data = {

        name: req.body.busname,
        number: req.body.busnumber,
        phone: req.body.phone,
        from: req.body.from,
        to: req.body.to,
        schedule: []
    }
    console.log(data);
    AgentData.addBus(req.session.user.email, data).then(result => {

        res.render("agentdashboard.ejs");
    }).catch(err => console.log(err));
}

exports.addschedule = (req, res, next) => {

    let data = {

        from: req.body.from,
        to: req.body.to,
        pickup: req.body.pickup,
        drop: req.body.drop,
        phone: req.body.phone,
        start_date: req.body.start_date,
        start_time: req.body.start_time,
        end_date: req.body.end_date,
        end_time: req.body.end_time,
        status: req.body.status,
        fc_amount: req.body.fc_amount,
        ec_amount: req.body.ec_amount,
        ac: req.body.ac,
        bookedseats: []
    }
    AgentData.addSchedule(req.session.user.email, req.body.travel, data).then(result => {

        return res.redirect(302, '/agent/bus');
    }).catch(err => console.log(err));
}

exports.updateschedule = (req, res, next) => {

    let t_id = req.params.tid;
    let id = req.params.id;
    let data = {

        from: req.body.from,
        to: req.body.to,
        pickup: req.body.pickup,
        drop: req.body.drop,
        phone: req.body.phone,
        start_date: req.body.start_date,
        start_time: req.body.start_time,
        end_date: req.body.end_date,
        end_time: req.body.end_time,
        status: req.body.status,
        fc_amount: req.body.fc_amount,
        ec_amount: req.body.ec_amount,
        ac: req.body.ac,
        bookedseats: req.session.user.bus[t_id + ""].schedule[id + ""].bookedseats
    }
    AgentData.updateSchedule(req.session.user.email, t_id, id, data).then(result => {

        return res.redirect(302, "/agent/bus");
    }).catch(err => console.log(err));
}