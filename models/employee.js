const mongoose= require('mongoose')
const Schema = mongoose.Schema;
const passportLocalMongoose= require('passport-local-mongoose')

const employeeSchema = new Schema ({
    email:{
        type: String,
        unique:true
    },
    workHour: [{
            workMonth: {
                type: String
            },
            workTime:{
                type: Number
            }
    }], 
    perHour: {
        type: Number
    }
})

employeeSchema.plugin(passportLocalMongoose);

module.exports= mongoose.model('Employee', employeeSchema)