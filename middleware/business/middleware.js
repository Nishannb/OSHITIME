
module.exports.requireLogin= ((req,res,next)=>{
    if(!req.session.currentAccount && !req.session.currentAccountName){
        return res.redirect('/firm/login')
    }
    next()
})

module.exports.requireUserLogin= ((req,res,next)=>{
    if(!req.session.userAccount){
        return res.redirect('/user/login')
    }
    next()
})