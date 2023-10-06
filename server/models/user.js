const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const uniqueValidator= require('mongoose-unique-validator');
const userSchema = new Schema({
  name: { type: String, requires: true },
  email: { type: String, requires: true,  unique:true},
  password: { type: String, requires: true,  minlength:6 },
  image:{type:String,require:true},
  places:[{type:mongoose.Types.ObjectId ,require:true, ref:'Place'}]
});

userSchema.plugin(uniqueValidator);
module.exports=mongoose.model('User',userSchema);
