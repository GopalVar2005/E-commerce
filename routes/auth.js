const express = require('express');
const router = express.Router() //mini instance
const User=require('../models/User')
const passport=require('passport')

// to show the signup form
router.get('/register', (req, res)=>{
    res.render('auth/signup')
})

// to actually want to register a user in DB
router.post('/register' , async(req,res, next)=>{
    try{
        let {email,password,username,role} = req.body;
        const user = new User({email,username,role});
        const newUser = await User.register(user , password );
        // res.redirect('/login');
        req.login( newUser , function(err){
            if(err){return next(err)}
            req.flash('success' , 'Welcome,  you are registed succesfully');
            res.redirect('/products');
        })
    }
    catch(e){
        req.flash('error' , e.message);
        return res.redirect('/register');
    }
})

// to get login form
router.get('/login', (req, res)=>{
    res.render('auth/login')
})

// to actually login via db
router.post('/login', 
            passport.authenticate('local', { failureRedirect: '/login', failureMessage:true }), 
            (req, res)=>{
                // console.log(req.user, 'sam')
                req.flash('success', 'Welcome Back')
                res.redirect('/products')
})

// logout`
router.get('/logout', (req, res, next) => {
    req.logout(function(err) {
        if (err) { return next(err); }  // forward error safely
        req.flash('success', 'Bye, come soon');
        res.redirect('/login');
    });
});
// always works in a callback function

module.exports = router;
