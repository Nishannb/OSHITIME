const mongoose= require('mongoose');
const Schema = mongoose.Schema;

const onDutySchema = new Schema ({
    username:{
        type: String
    },
    onduty: Boolean,
    startWork:{
        startMonth: {
            type: String
        },
        startTime:{
            type: Number
        }
    }
})

module.exports= mongoose.model('OnDuty', onDutySchema);