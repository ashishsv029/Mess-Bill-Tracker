const express=require('express');
const router=express.Router();
const bcrypt=require('bcryptjs');  //here used for hashing password
const passport=require('passport');  //here used for authentication
//user model
//later this user object is used to create a instance for database
const  User  =require('../models/User');
const Record =require('../models/Record');
//router.get('/',(req,res)=>res.send('<h1>Welcome</h1>'));
//Login page
//   /login indirectly means /users/login
router.get('/login',(req,res)=>res.render("login"));
//Register page
router.get('/register',(req,res)=>res.render("register"));
//Register handle
router.post('/register',(req,res)=>{
    //console.log(req.body);
    //res.send("hello src");
    //ALL THE PARAMETER VALUES ARRIVED FROM FORM ARE STORED IN REQUEST BODY
    const {name,email,password,password2}=req.body;
    let errors=[];
    //check required fields
    if(!name||!email||!password||!password2)
    {
        errors.push({msg: 'Please fill all details'});
    }
    //check password match
    if(password!=password2)
    {
        errors.push({msg:"passwords didnt matched"});

    }
    if(password.length<6){
        errors.push({msg :"passwords should be atleast 3 characters"});
    }
    if(errors.length>0)
    {
        //send all the 5 parameters including errors to the register.ejs
        //there in values field these are handled
        res.render('register',{
            errors,
            name,
            email,
            password,
            password2
        });
    }else{
        //res.send('passed');
        //it will return the concerned user
        User.findOne({email:email})
        .then(user => {
            if(user){
                //user exists
                errors.push({msg:"email is already registered"});
                res.render('register',{
                    errors,
                    name,
                    email,
                    password,
                    password2
                });
            }else{
                //encrypt pwd
                //if there is no such user create one user instance by sending the required attributes
                const newUser=new User({
                    name,
                    email,
                    password
                });
                console.log(newUser);
                //res.send("Hello");
                //HASH PASSWORD
                bcrypt.genSalt(10,(err,salt)=>bcrypt.hash(newUser.password,salt,(err,hash)=>{
                    if(err) throw err;
                    //set password to hash
                    newUser.password=hash;
                    //save user
                    newUser.save()
                    .then(user=>{
                        //telling that flash a success_msg and content='you are now registerd...'
                        //it goes to it's handle in app.js
                        req.flash('success_msg','you are now registered and can login');
                        res.redirect('/users/login');
                    })
                    .catch(err=>console.log(err));
                }))

            }
        });
    }
});

//login handle
router.post('/login',(req,res,next)=>{
    passport.authenticate('local',{
        successRedirect:'/dashboard',
        failureRedirect:'/users/login',
        failureFlash:true
    })(req,res,next);
});

router.get('/errors',(req,res)=>{
    res.render("errormsg")
})
//Records handle
router.post('/upload',(req,res)=>{
    console.log(req.body)
    const {name,email,amount,status}=req.body;
    const newRecord=new Record({
        name,
        email,
        status,
        amount
    });
    if(status==''||amount=='')
    {
        res.redirect("/users/errors")
    }
    newRecord.save()
    .then(record=>{
        res.redirect("/dashboard")
    })
    

});
router.get("/history",(req,res)=>{
    Record.find({email:req.user.email})
    .then(rec=>{res.render("history",{name:req.user.name,records:rec})});
});

//get request handle for about
router.get('/about',(req,res)=>{
    res.render("about")
});
//logout handle
router.get('/logout',(req,res)=>{
    req.logout();
    req.flash('success_msg','You are logged out');
    res.redirect('/users/login');
});
module.exports=router;

