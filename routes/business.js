const express = require('express')
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const Businesses= require('../models/partnerbusiness')
const bcrypt = require('bcrypt')
const {requireLogin}= require('../middleware/business/middleware')
const Employee= require('../models/employee');


router.get('/register', wrapAsync((req,res)=>{
    res.render('business/register')
}))

router.post('/register', wrapAsync(async(req,res)=>{
    const {username, email, nearestLocation, phoneNum, password, RePassword, pinCode}= req.body;
    if(password===RePassword){
        const hashpw= await bcrypt.hash(password, 12);
        const registerBusiness= new Businesses({
            username: username, email: email, location: nearestLocation, phoneNum: phoneNum, password: hashpw, pinCode:pinCode})
            await registerBusiness.save();
            req.session.currentAccount= registerBusiness.id;
<<<<<<< HEAD
            req.session.currentAccountName = registerBusiness.username;
=======
            req.session.currentAccountName = foundBusiness.username;
>>>>>>> f853d87b2f75682395af44e110d42942eb21a17d
            req.flash('success', 'Successfully registered your Business account')
            return res.redirect('/home')
    } else{
        res.redirect('/firm/register')
    }
}))

router.get('/login', wrapAsync((req,res)=>{
    res.render('business/login');
}))

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

router.post('/logout', requireLogin, wrapAsync((req,res)=>{
    req.flash('success', 'Successfully logged Out..')
    req.session.currentAccount = null;
    return res.redirect('/firm/login')
}))

router.get('/team', requireLogin, wrapAsync(async(req,res)=>{
    const teamList= await Businesses.findById(req.session.currentAccount).populate('employees')
    res.render('business/teams/team', {teamList})
}))

router.get('/addteam',requireLogin, wrapAsync(async(req,res)=>{ 
    res.render('business/teams/addteam')
}))

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

router.get('/insights',requireLogin, wrapAsync(async(req,res)=>{
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
}))

router.get('/manageshift',requireLogin, wrapAsync(async(req,res)=>{
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
    testDate = timeperiod.slice(16,31)
    const teamList= await Businesses.findById(req.session.currentAccount).populate('employees')
    res.render('business/manageshift', {teamList, date, testDate})
}))

router.post('/logshift', requireLogin, wrapAsync(async(req,res)=>{
    const {date, employname,change}= req.body;
    const teamList= await Businesses.findById(req.session.currentAccount).populate('employees');
    for(let team of teamList.employees){
        if(team.username == employname){
            const employee = await Employee.findOne({username: team.username})
            employee.workDetail.unshift({workDay:`${date.slice(4,15)}`, workTime: change})
            await employee.save()    
            break
        }
    }
    
    res.redirect('/firm/manageshift')
}))

//check for error - error msg reported previously 
router.get('/about',requireLogin, wrapAsync((req,res)=>{
    res.render('business/about')
}))

//check for error - error msg reported previously --login not required per now
router.get('/contact', wrapAsync((req,res)=>{
    res.render('business/contact')
}))


module.exports = router;