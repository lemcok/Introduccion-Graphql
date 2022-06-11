import mongoose from 'mongoose'
const schema = new mongoose.Schema({
   name: {
      type: String,
      required: true,
      unique: true,
      minlength: 3
   },
   phone: {
      type: String,
      minlength: 5
   },
   street: {
      type: String,
      required: true,
      minlength: 4
   },
   city: {
      type: String,
      required: true,
      minlength: 5
   },
},
{
   versionKey: false
})

export default mongoose.model('Person', schema)