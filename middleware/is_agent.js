module.exports = (req, res, next) => {

    if (!req.session.isAgent) {
        return res.redirect(302, '/agent/login');
    }

    next();
}