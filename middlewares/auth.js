function auth(req, res, next) {

    if (!req.session.usuario) {
        return res.redirect("/login.html");
    }
    next();
}

module.exports = auth;
