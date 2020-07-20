exports.home = (req, res, next) => {

    console.log(req.session);
    console.log("Login");
    res.render("index.ejs");
}