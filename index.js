const exp = require("express");
const path = require("path");
const body = require("body-parser");
const app = exp();
const mongoConnect = require('./utils/database').mongoConnect;
const session = require('express-session');
const mongoDBStore = require('connect-mongodb-session')(session);
const flash = require('connect-flash');
const isAuth = require('./middleware/is_auth');
const csrf = require('csurf');
const UserRoute = require('./routes/user');
const HomeRoute = require("./controllers/home");
const BusRouter = require('./routes/bus');
const AgentRouter = require("./routes/agent");


const store = new mongoDBStore({
    uri: 'mongodb+srv://Balaji:Balaji123@nodejs-zpqrp.mongodb.net/bus?retryWrites=true&w=majority',
    collection: 'sessions'
})

app.set("view engin", "ejs");
app.set("views", "views");


const csrfProtection = csrf();
app.use(exp.static(path.join(__dirname, "public")));
app.use(body.urlencoded({
    extended: true
}));
app.use(
    session({
        secret: 'my secret',
        resave: false,
        saveUninitialized: false,
        store: store
    })
);
app.use(flash());

app.use(csrfProtection);

app.use((req, res, next) => {

    res.locals.isAgentAuthentication = req.session.isAgent;
    res.locals.isAuthentication = req.session.isLoggedIn;
    res.locals.csrfTocken = req.csrfToken();
    next();
})

app.use("/agent", AgentRouter);
app.use('/user', UserRoute);
app.use('/bus', BusRouter);
app.use('/home', HomeRoute.home);

mongoConnect(() => {

    app.listen(3001);
})