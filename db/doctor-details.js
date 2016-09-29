var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var DoctorDetails = new Schema({
  name: { type: String },
  designation: { type: String },
  email: { type: String }
});
module.exports = mongoose.model('DoctorDetails', DoctorDetails);