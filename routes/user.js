const express = require('express')
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const Employee= require('../models/employee');
const passport = require('passport');
const {requireUserLogin}= require('../middleware/business/middleware');
const { object } = require('joi');

router.get('/register', (req, res)=>{
    res.render('employee/register')
})

router.post('/register', wrapAsync(async(req,res)=>{
    const {username, email, password, RePassword}= req.body;
    if (password===RePassword){
        const user = new Employee({username: username, email: email});
        const registerUser = await Employee.register(user, password);
        req.flash('success', 'Successfully registered a user!')
    }
    else{
        req.flash('error', "Password didn't match. Please re-confirm your password..")
        res.redirect('/user/register')
    }
    res.redirect('/home')
}))

router.get('/login', (req,res)=>{
    res.render('employee/login')
})

router.post('/login',passport.authenticate('local', {failureFlash: true, failureRedirect:'/user/login',keepSessionInfo:true}), wrapAsync( async(req,res)=>{
    let{username, password}= req.body;
    if(password===process.env.RANDOM_STR){
        req.flash('error', 'Please change password to activate your account!')
        return res.redirect('/user/firstlogin')
    }
    const searchUser= await Employee.findOne({username:username});
    if(searchUser){
        req.session.userAccount = searchUser.id
    }
    res.redirect('/user/profile');

    /* dividing milliseconds by 1000 * 60 * 60 = 3600000 to obtain in hours */
}))

router.get('/profile',requireUserLogin, wrapAsync(async(req,res)=>{
    const searchUser= await Employee.findOne({_id:req.session.userAccount});
    const username = searchUser.username
    totalWork = 0;
    todayWork = 0;
    shift =0;
    month = Date().slice(4,7)
    perHour = searchUser.perHour
    for(let userdata of searchUser.workHour){
        if(userdata.workMonth.slice(0,3) === Date().slice(4,7)){
            shift++;
            let userWorkTime = (userdata.workTime/3600000).toFixed(1)
            if(parseInt(userWorkTime.toString().split('.')[1]) < 5){
                userWorkTime = Math.floor(userWorkTime)
            } else{
                userWorkTime = Math.floor(userWorkTime).toString();
                userWorkTime = parseFloat(userWorkTime + '0.5')
            }
            totalWork = totalWork + userWorkTime
        }
        if(userdata.workMonth === Date().slice(4,10)){
            todayWorkTime = (userdata.workTime/3600000).toFixed(1)
            if(parseInt(todayWorkTime.toString().split('.')[1]) < 5){
                todayWorkTime = Math.floor(todayWorkTime)
            } else{
                todayWorkTime = Math.floor(todayWorkTime).toString();
                todayWorkTime = parseFloat(todayWorkTime + '0.5')
            }
            todayWork = todayWork + todayWorkTime
        }
    }
    res.render('employee/payslip', {todayWork, shift, totalWork, perHour, username, month})
}))

router.get('/schedule',requireUserLogin, async(req, res)=>{
    if(!req.query.timeperiod){
        let date = Date()
        for(i=86400000; i<=518400000; i=i+86400000){
            if(String(date).slice(0,3)!=='Mon'){
                date = Date.now() + i
                date = new Date(date)
            }
        }
        date = String(date).slice(0,15)
        let testDate = new Date(date).getTime() + 518400000
        testDate = new Date(testDate)
        testDate = String(testDate).slice(0,15)
        timeperiod = `${date}-${testDate}`
    } else{
        timeperiod = req.query.timeperiod
    }
    date = timeperiod.slice(0,15)
    testDate = timeperiod.slice(16,31);

    res.render('employee/schedule', {date, testDate})
})

router.post('/shift',requireUserLogin, wrapAsync(async(req,res)=>{
    const shifts = req.body
    const currentUser= await Employee.findOne({_id: req.session.userAccount});
    console.log(currentUser)
        for(const shift in shifts){
            if(shifts[shift]!==''){
                currentUser.workDetail.unshift({workDay: shift, workTime: shifts[shift]})
                await currentUser.save()
            }
        }
    res.redirect('/user/profile')
}))


router.post('/logout', async(req,res)=>{
    req.session.userAccount= null;
    res.redirect('/user/login')
})

router.get('/firstlogin', (req,res)=>{
    const pass= process.env.RANDOM_STR
    res.render('employee/firstlogin', {pass})
})


router.post('/firstlogin',passport.authenticate('local', {failureFlash: true, failureRedirect:'/user/login'}), wrapAsync(async(req,res)=>{
    const {username, email, password,newPassword, RePassword}= req.body;
    if (newPassword===RePassword){
        const user = await Employee.findOne({username: username});
        user.email=email;
        const changePwd = await user.setPassword(RePassword)
        await user.save()
        req.flash('success', 'Successfully set your new password!')
    }
    else{
        req.flash('error', "Password didn't match. Please re-confirm your password..")
        return res.redirect('/user/firstlogin')
    }
    req.flash('success', 'Please login with your set credentials')
    res.redirect('/user/login')
}))


module.exports=router;