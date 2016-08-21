var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var DoctorDetails = new Schema({
  name: { type: String, required: true },
  designation: { type: String, required: true },
  email: {type: String, required: true },
  realname: {type: String, required: true }
});
module.exports = mongoose.model('DoctorDetails', DoctorDetails);