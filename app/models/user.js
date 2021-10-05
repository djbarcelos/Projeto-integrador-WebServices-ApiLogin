const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
   name: {
      type: String,
      require: true,
   },
   surname: {
      type: String,
      require: true,
   },
   cpf: {
      type: String,
      unique: true,
      require: true,
   },
   email: {
      type: String,
      unique: true,
      require: true,
      lowercase: true
   },
   password: {
      type: String,
      require: true,
      select: false
   },
   phone: {
      type: String,
      require: false,
   },
   passwordResetToken: {
      type: String,
      select: false,
   },
   passwordResetExpires: {
      type: Date,
      select: false,
   },
   createdAt: {
      type: Date,
      default: Date.now,
   }
});

module.exports = mongoose.model('User', UserSchema);