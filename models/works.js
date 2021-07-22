var mongoose = require('mongoose');
var worksSchema = require('../schemas/works');
var Works = mongoose.model('Works', worksSchema)
module.exports = Works
