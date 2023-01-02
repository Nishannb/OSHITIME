if(process.env.NODE_ENV !=="production") {
    require('dotenv').config();
}

const express=require('express');
const app= express();
const mongoose = require('mongoose')
const ejsMate = require('ejs-mate')
const path = require('path')
const passport= require('passport')
const LocalStrategy= require('passport-local');
const session = require('express-session')
const flash = require('connect-flash')
const AppError = require('./utils/Apperror')
const userRoute = require('./routes/user')
const businessRoute = require('./routes/business')
const homeRoute = require('./routes/home');
const Employee = require('./models/employee');
const mongoSanitize=require('express-mongo-sanitize');
const MongoStore = require('connect-mongo');
const dbUrl= process.env.DB_URL || 'mongodb://localhost:27017/testOshiTime';
const secret= process.env.SECRET || 'thisisnotasecret'
// const dbUrl = 'mongodb://localhost:27017/testOshiTime'

mongoose.connect(dbUrl)



const db= mongoose.connection;
db.on('error', console.error.bind(console, 'Connection Error'));
db.once('open', ()=>{
    console.log('Database connected')
})


app.use(express.urlencoded({extended: true}));
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, 'public')));

const store = MongoStore.create({
    mongoUrl: dbUrl,
    secret: secret,
    touchAfter: 24 * 60 * 60       //in seconds
})
store.on('error', function(e){
    console.log('Session store error', e)
})
app.use(session({
    store:store,
    secret: secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true,
        expires: Date.now()+1000*60*60*24*7,      //in milliseconds
        maxAge: 1000*60*60*24*7
    }
}));
app.use(flash())

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(Employee.authenticate()));
passport.serializeUser(Employee.serializeUser());
passport.deserializeUser(Employee.deserializeUser());


app.use((req,res,next)=>{
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currentAccount = req.session.currentAccount;
    res.locals.currentAccountName = req.session.currentAccountName;
    next()
})

app.get('/', (req,res)=>{
    return res.redirect('/firm/login')
})

app.use('/home', homeRoute)

/* User section */
app.use('/user', userRoute);
/* User section */

/* Business section */
app.use('/firm', businessRoute)
/* Business section */


app.all('*', (req,res,next)=>{
    next(new AppError('Page not Found', 404))
})
app.use((err,req,res,next)=>{
    const {status = 500}= err;
    if(!err.message) err.message= 'Something Went Wrong'
    return res.status(status).render('error', {err})
})

const port = process.env.PORT || 3000;
app.listen(port, ()=>{
    console.log(`Connection established at port ${port}`)
})