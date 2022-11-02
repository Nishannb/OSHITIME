const mongoose= require('mongoose');
const Schema = mongoose.Schema;

const shiftSchema = new Schema ({
    username:{
        type: String
    },
    workDetail:{
        workMonth:{
            workDay: {
                type: String
            },
            workStartTime:{
                type: Number
            },
            workEndTime:{
                type: Number
            }
        }
    }
})

module.exports= mongoose.model('Shifts', shiftSchema);