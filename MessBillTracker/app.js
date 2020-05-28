const express=require('express');
const expressLayouts=require('express-ejs-layouts');
const mongoose=require('mongoose');
const flash=require('connect-flash');
const session=require('express-session');
const app=express();
const passport=require('passport');
//passport config
require('./config/passport')(passport);

//DB CONFIG
const db=require('./config/keys').MongoURI;
//connect to Mongo
//deal with deprication warningd so usenewurlparser:true
//or instead of doing it seperatly for each db connection as below..u can set it globally for every connection
//mongoose.set('useNewUrlParser',true)
mongoose.connect(db,{ useNewUrlParser: true})
.then(()=> console.log('MongoDB Connected...'))
.catch( err=> console.log(err));
app.use(express.static(__dirname+'/public'))
//EJS
//for using middlewares u need to include app.use/passport.use...
app.use(expressLayouts);
//express uses jade as its default template engine
//the below line changes it to ejs
app.set('view engine','ejs');
//Bodyparser
app.use(express.urlencoded({extended: false}));

//EXPRESS SESSION MIDDLEWARE
app.use(session({
    secret: 'secret',//any secret string 
    resave: true,
    saveUninitialized: true,
  }));

  //passport middleware
  //passport.initialize() middleware is required to initializd passport
  //if your applications uses persistent login sessions passport.session() middleware must also be used
  app.use(passport.initialize());
  app.use(passport.session());
  //connect flash
  //it is a middleware  that is a special area of the session used for storing messages
  app.use(flash());
  //to have different values for different msgs
  //use global vars
  app.use((req,res,next)=>{
    res.locals.success_msg= req.flash('success_msg');
    res.locals.error_msg= req.flash('error_msg');
    res.locals.error= req.flash('error');
    next();
  });
//ROUTES
app.use('/',require('./routes/index'));
app.use('/users',require('./routes/users'));
const PORT=process.env.PORT || 5000;
app.listen(PORT,console.log(`server started at port no ${PORT}`));