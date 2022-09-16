
module.exports.requireLogin= ((req,res,next)=>{
    if(!req.session.currentAccount){
        return res.redirect('/firm/login')
    }
    next()
})