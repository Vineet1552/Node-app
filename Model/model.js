// model.js
const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    studentEmail: String,
    studentPhone: Number,
    dialCode: Number,
    password: String,
    jti: String
    
}, {timestamps: true});

const marksSchema = new mongoose.Schema({
    id:{
        type: mongoose.Schema.Types.ObjectId,
        ref : 'Data1'
    }, 
    subjectName: String,
    marks: Number,
}, {
    timestamps: true
})

const Data1 = mongoose.model('Data1', studentSchema);
const Data2 = mongoose.model('Data2', marksSchema);

module.exports = {
    Data1,
    Data2,
}
