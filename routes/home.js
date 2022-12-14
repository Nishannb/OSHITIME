const express = require('express')
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const OnDuty= require('../models/onduty');
const Employee= require('../models/employee');
const { requireLogin }= require('../middleware/business/middleware')


router.get('/',requireLogin, async(req,res)=>{
    const onDutyUser = await OnDuty.find({})
    return res.render('business/home', {onDutyUser})
})

router.post('/start',requireLogin,wrapAsync(async(req,res)=>{
    const {username}= req.body;
    const todayDate= Date().slice(4,15) 
    const findUser = await Employee.findOne({username}); //check for error
    if(!findUser){
        req.flash('error', 'Incorrect Employee ID..')
        return res.redirect('/home');
    }
    else{
        const checkUserActiveStatus = await OnDuty.findOne({username: `${username}`});
        if(checkUserActiveStatus){
            req.flash('error', 'Employee might already have logged in before, please check')
            return res.redirect('/home')
        } else{
        const dutyRegister= new OnDuty({username: `${username}`, onduty: true, startWork: {
            startMonth: `${todayDate}`,
            startTime: Date.now()
            }});
        await dutyRegister.save();
        req.flash('success', 'Workshift starts now..')
        res.redirect('/home');
    }}
}))


router.post('/stop',requireLogin,wrapAsync(async(req,res)=>{
    const {username}= req.body;
    const user= await Employee.findOne({username: `${username}`})
    const confirmonDuty = await OnDuty.findOne({username: `${username}`})
    if(!user){
        req.flash('error', 'Incorrect Employee ID..')
        return res.redirect('/home')
    }
    else{
        if(!confirmonDuty){
            req.flash('error', 'No Workshift was started before..')
            return res.redirect('/home')    
        }
        else{
            StartedTime = new Date(confirmonDuty.startWork.startTime)
            StartedTime = StartedTime.toString().slice(16,24)
            user.workHour.unshift({
                workMonth:`${confirmonDuty.startWork.startMonth}`,
                workTime: `${Date.now()-confirmonDuty.startWork.startTime}`, 
                timeCard: `${StartedTime} - ${Date().slice(16,24)}`
            } )
            await user.save()
            await OnDuty.deleteOne({username: `${username}`})
            req.flash('success', 'Workshift ends now..')
            res.redirect('/home')
        }
    }
}))
module.exports = router;