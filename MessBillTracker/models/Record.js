const mongoose=require('mongoose');
const RecordSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    status:{
        type:String,
        required:true
    },
    amount:{
        type:Number,
        required:true
    },
    date:{
        type:Date,
        default:Date.now
    }
});
const Record = mongoose.model('Record',RecordSchema);
//the 1st parameter specifies what name to be mapped with the schema
//this model can be then accessed anywhere in our application by calling  mongoose.model('User')
module.exports=Record