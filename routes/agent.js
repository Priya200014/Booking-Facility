const exp = require("express");
const path = require("path");
const rootDir = require("../utils/path");
const controller = require('../controllers/agent');
const AgentRouter = exp.Router();
const {
    check
} = require('express-validator');
const isAuth = require('../middleware/is_agent');
const isAlrdAuth = require('../middleware/is_already_auth');

AgentRouter.get('/login', isAlrdAuth, (req, res, next) => {

    console.log("Agent log");
    let message = req.flash('error');

    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render("agentlog.ejs", {
        errorMessage: message
    });
});


AgentRouter.post("/logout", isAuth, (req, res, next) => {


    req.session.isAgent = false;
    req.session.isLoggedIn = false;
    req.session.user = null;
    req.session.destroy((err) => {

        console.log(err);
        res.redirect(302, '/agent/login');
    })
});

AgentRouter.get('/signup', isAlrdAuth, (req, res, next) => {

    console.log("Agent sign");
    let message = req.flash('error');

    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render("agentsign.ejs", {
        errorMessage: message
    });
});

AgentRouter.post("/loginsuccess", isAlrdAuth, check('email').isEmail().withMessage('Please enter valid email'), controller.loginsuccess);
AgentRouter.post("/signupsuccess", isAlrdAuth, check('email').isEmail().withMessage('Please enter valid email'), controller.signupsuccess);
AgentRouter.get('/dashboard', isAuth, controller.dashboard);
AgentRouter.get('/bus', isAuth, controller.busdetails);
AgentRouter.post('/addbus', isAuth, controller.addbus);
AgentRouter.post('/addschedule', isAuth, controller.addschedule);
AgentRouter.post('/updateschedule/:tid/:id', isAuth, (req, res, next) => res.render("agentscheduleupdate.ejs", {
    tid: req.params.tid,
    id: req.params.id,
    travel: req.session.user.bus[req.params.tid + ""].name,
    data: req.session.user.bus[req.params.tid + ""].schedule[req.params.id + ""]
}));
AgentRouter.post("/update_data_schedule/:tid/:id", controller.updateschedule);

module.exports = AgentRouter;