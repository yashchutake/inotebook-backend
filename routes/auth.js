const express = require('express');
const User = require("../models/User")
const router = express.Router();
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var fetchuser=require('../middelware/fetchuser');

//special flavor added by you
const JWT_SECRET='Yashisawesome@beast';

//to use express validator
const { body, validationResult } = require('express-validator');

// ROUTE 1 : creating a User using:POST"/api/auth/. Dosen't requroed auth"  NO Login req
//creating cutom create user path
router.post('/createuser', [
    body('name', 'Enter valid name').isLength({ min: 3 }),
    body('email', 'Enter valid email').isEmail(),
    body('password', 'Enter valid Password 5 characters minimum').isLength({ min: 5 }), //.isStrongPassword(),

], async (req, res) => {
    let success=false; //for user auth
    //If there any error , return bad request and th error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({success, errors: errors.array() });

    }
    //check wherther the iuser with same email exisy oor not

    try{
        //check whether user with this email is exist already or not
        let user=await User.findOne({email:req.body.email});
        if(user){// if true then andar ghhus say email exist else banda de user
            return res.status(400).json({success,error:"Sorry a user with same email exists"});
        }

        //password salt
        const salt=await bcrypt.genSalt(10);
        const secPass=await bcrypt.hash(req.body.password,salt);

        //Create new user
        user= await User.create({
            name: req.body.name,
            email: req.body.email,
           // password: req.body.password,
            password:secPass,
        });
        //res.json(user)
        // .then(user => res.json(user))
        // .catch(err=>{console.log(err)
        // res.json({error:'Please Enter a Unique value for email',message:err.message})})
    
        const data={
            user:{
                id:user.id
            }
        }
        const authtoken=jwt.sign(data,JWT_SECRET);
        success=true;
        res.json({success,authtoken})
    }
    catch(error){
        console.error(error.message);
        res.status(500).send("Internal Server Error");

    }
   
    //res.send(req.body);


    // console.log(req.body);
    // const user=User(req.body);
    // user.save();
    // res.send(req.body);
    // res.send("Hello")

    
    // const User = mongoose.model('user', UserSchema);
    // User.createIndexes();
    // module.exports = User


})

//  ROUTE 2 : Authenticate a User using: POST "/api/auth/login". No login required

router.post('/login', [
    body('email', 'Enter valid email').isEmail(),
    body('password', 'password cannot be blank').exists(), //.isStrongPassword(),

], async (req, res) => {
    //If there any error , return bad request and th error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {email,password}=req.body;
    try {
        let user=await User.findOne({email});
        if(!user){//if email not exits
            return res.status(400).json({ errors:'Please Try Login With Correct Credentials'});
        }
        const passwordCompare=await bcrypt.compare(password,user.password);// compare user enter passsword with database one
        if(!passwordCompare){//not match
            let success=false; 
            return res.status(400).json({ errors:'Please Try Login With Correct Credentials'});
        }
    
        //if matched then give auth token
        const data={
            user:{
                id:user.id
            }
        }
        const authtoken=jwt.sign(data,JWT_SECRET);
        success=true; 
        res.json({success,authtoken})
    
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

//  ROUTE 3 : Get loged in  User Details using: POST "/api/auth/login". No login required

router.post('/getuser',fetchuser, async (req, res) => {//fetchuser is middlewre
    try {
        userId=req.user.id;
        const user=await User.findById(userId).select("-password")
        res.send(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
   
})
module.exports = router
