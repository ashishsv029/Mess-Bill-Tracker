const Localstrategy=require('passport-local').Strategy;
const mongoose=require('mongoose');
const bcrypt=require('bcryptjs');

//load user model

const user=require('../models/User')
module.exports=function(passport){
    passport.use(
        new Localstrategy({usernameField:'email'},(email,password,done)=>{
                //Match User
                user.findOne({email: email})
                //the user is coming from the database it has all attributes
                .then(user=>{
                    //if user is not returned i.e no match found case
                    if(!user){
                        return done(null,false,{message:'That email is not registered'});
                    }
                    //if user found
                    //match password
                    bcrypt.compare(password,user.password,(err, isMatch)=>{
                        if(err) throw err;
                        if(isMatch){
                            return done(null,user);
                        }else{
                            return done(null,false,{message: 'Password incorrect'});
                        }
                    });
                })
                .catch(err=>console.log(err))
        })
    );

    //to maintain sessions

    //serialize:-setting cookie in users browser
    passport.serializeUser((user,done)=>{
        done(null,user.id);
    });
    //deserialize:getting id from the user
    passport.deserializeUser((id,done)=>{
        user.findById(id,(err,user)=>{
            done(err,user);
        });
    });

}
