const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CollaboratorSchema = new Schema({
   specialty: [
      {
         type: String,
         lowercase: true,
         require: true,
      }
   ],
   user: {
      type: Schema.Types.ObjectId,
      lowercase: true,
      require: true,
      unique: true,
   },
   createdAt: {
      type: Date,
      default: Date.now,
   },
});

module.exports = mongoose.model('Collaborator', CollaboratorSchema);