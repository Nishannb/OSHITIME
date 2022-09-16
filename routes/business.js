const express = require('express')
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const Businesses= require('../models/partnerbusiness')
const bcrypt = require('bcrypt')
const {requireLogin}= require('../middleware/business/middleware')
const Employee= require('../models/employee');



router.get('/register', (req,res)=>{
    res.render('business/register')
})

router.post('/register', wrapAsync(async(req,res)=>{
    const {username, email, nearestLocation, phoneNum, password, RePassword, pinCode}= req.body;
    if(password===RePassword){
        const hashpw= await bcrypt.hash(password, 12);
        const registerBusiness= new Businesses({
            username: username, email: email, location: nearestLocation, phoneNum: phoneNum, password: hashpw, pinCode:pinCode})
            await registerBusiness.save();
            req.session.currentAccount= registerBusiness.id;
            req.flash('success', 'Successfully registered your Business account')
            return res.redirect('/home')
    } else{
        res.redirect('/firm/register')
    }
}))

router.get('/login', (req,res)=>{
    res.render('business/login');
})

router.post('/login', wrapAsync(async(req,res)=>{
    const{ username, password}= req.body;
    const foundBusiness = await Businesses.findAndValidate(username, password);
    if(foundBusiness){
        req.session.currentAccount = foundBusiness.id;
        req.session.currentAccountName = foundBusiness.username;
        req.flash('success', 'Successfully logged In..')
        return res.redirect('/home')
    } else{
        req.flash('error', 'Incorrect Username or password..')
        return res.redirect('/firm/login')
    }
}))

router.post('/logout', requireLogin, ((req,res)=>{
    req.flash('success', 'Successfully logged Out..')
    req.session.currentAccount = null;
    return res.redirect('/firm/login')
}))

router.get('/team', requireLogin, async(req,res)=>{
    const teamList= await Businesses.findById(req.session.currentAccount).populate('employees')
    res.render('business/teams/team', {teamList})
})

router.get('/addteam',requireLogin, async(req,res)=>{ 
    res.render('business/teams/addteam')
})

router.post('/addteam',requireLogin, wrapAsync(async(req,res)=>{
    const{username, perHour, pinCode, email, password=process.env.RANDOM_STR}= req.body;
    console.log(password)
    const searchBusiness = await Businesses.findById(req.session.currentAccount);
    const checkUser = await Employee.findOne({username:username});
    if(parseInt(pinCode)!==searchBusiness.pinCode){
        req.flash('error', 'Incorrect 4-digit Pin-Code. Please try again')
        return res.redirect('/firm/addteam')
    }
    if(checkUser){
        searchBusiness.employees.push(checkUser.id);
        await searchBusiness.save();
        req.flash('success', 'Successfully added a employee!')
        return res.redirect('/firm/addteam')
    }
    const user = new Employee({username:username, perHour:perHour, email:email});
    const registerUser = await Employee.register(user,password)
    searchBusiness.employees.push(registerUser.id);
    await searchBusiness.save();
    req.flash('success', 'Successfully registered a employee!')
    res.redirect('/firm/addteam')
}))

router.get('/insights',requireLogin, async(req,res)=>{
    currentMonth = req.query.month
    if(Object.keys(req.query).length===0){
        currentMonth = Date().slice(4,7)
    }
    const teams= await Businesses.findById(req.session.currentAccount).populate('employees')
    teamList=[]
    totalWork = 0
    for(let employee of teams.employees){
        const user = await Employee.findOne({username: employee.username})
        for(let timedata of user.workHour){
            if(timedata.workMonth.slice(0,3) !== currentMonth){
                continue
            }
            let userWorkTime = (timedata.workTime/3600000).toFixed(1)
            if(parseInt(userWorkTime.toString().split('.')[1]) < 5){
                userWorkTime= Math.floor(userWorkTime)
            } else{
                userWorkTime = Math.floor(userWorkTime).toString();
                userWorkTime = parseFloat(userWorkTime + '0.5')
            }
            totalWork = totalWork + userWorkTime;
        } 
        teamList.push({employee: user.username, workTime: totalWork})
        totalWork = 0;
    }
    
    res.render('business/insights', {teamList, currentMonth})
})


router.get('/about', (req,res)=>{
    res.render('business/about')
})
router.get('/contact', (req,res)=>{
    
    res.render('business/contact')
})


module.exports = router;