const express=require('express');
const Record =require('../models/Record');
const router=express.Router();
const {ensureAuthenticated}=require('../config/auth') ;
router.get('/',(req,res)=>res.render('welcome'));
//ensure authenticated is a middleware for protection during sessoins
router.get('/dashboard',ensureAuthenticated,(req,res)=>{
    var recs;
    Record.find({email:req.user.email})
    .then(rec=>{ res.render('dashboard',{name:req.user.name,email:req.user.email,records:rec});})
    
   
})
module.exports=router;