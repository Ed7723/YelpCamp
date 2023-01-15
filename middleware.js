module.exports.isLoggedIn = (req,res)=>{
    if(!req.isAuthenticated()){
        req.flash('error','You must be signed in first!');
        return res.redirect('/login');
    }
    next();
}