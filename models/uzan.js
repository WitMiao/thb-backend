var mongoose = require('mongoose');
var uzanSchema = require('../schemas/uzan');
var Uzan = mongoose.model('Uzan', uzanSchema)
module.exports = Uzan
