//this module is used as a middleware
//here if it is used then by changing the route to localhost:5000/dashboard u cant enter again if u are logged out
//if not used u can logout then enter again by changing the url 
//u need to login again if u want to enter
module.exports={
    ensureAuthenticated: function(req,res,next){
        if(req.isAuthenticated()){
            return next();
        }
        //generally flash messages are created before redirection
        //those created ones are displayed in the next module display
        req.flash('error_msg','please log in again');
        res.redirect('/users/login');
    }
}