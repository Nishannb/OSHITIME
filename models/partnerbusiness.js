const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt')


const businessesSchema = new Schema ({
    email: {
        type: String,
        required: true, 
        unique: true
    },
    location:{
        type: String,
        required: true
    }, 
    phoneNum:{
        type: String,
    }, 
    employees: {
        type: [Schema.Types.ObjectId],
        ref: 'Employee'
    }, 
    username:{
        type: String, 
        required: true,
        unique: true
    },
    password:{ 
        type: String, 
        required: true
    }, 
    pinCode:{
        type: Number, 
        max: 9999
    }
})

businessesSchema.statics.findAndValidate = async function(username, password){
    const foundBusiness= await this.findOne({username:username});
    if(!foundBusiness){
        return false;
    }
    const isValid = await bcrypt.compare(password, foundBusiness.password);
    return isValid ? foundBusiness: false;

}

module.exports = mongoose.model('Businesses', businessesSchema); 