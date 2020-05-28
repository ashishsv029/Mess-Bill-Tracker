const mongoose=require('mongoose');
const UserSchema=new mongoose.Schema({
    //or simply
    //name:String
    //email:String
    //password:String
    //date:Date
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default:Date.now
    }
});
const User = mongoose.model('User',UserSchema);
//the 1st parameter specifies what name to be mapped with the schema
//this model can be then accessed anywhere in our application by calling  mongoose.model('User')
module.exports=User