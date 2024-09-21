import mongoose from 'mongoose'
const resumeSchema = new mongoose.Schema({
    email:{
        type :String,
        required :true,
    },
    city: {
        type :String,
        required :true,
    },
    state: {
        type :String,
        required :true,
    },
    name: {
        type :String,
        required :true,
    },
    phoneNumber: {
        type :String,
        required :true,
    },
    exCompany: {
        type :String,
        required :true,
    },
    skills: {
        type :[String],
        required :true,
    },
    resumePath: {
        type :String,
        required :true,
    },  // Save the path to the resume
  });

  const resumeModel = mongoose.model('resume',resumeSchema)
  export default resumeModel

  