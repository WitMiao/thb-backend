var mongoose = require('mongoose');
var ucommentSchema = require('../schemas/ucomment');
var Ucomment = mongoose.model('Ucomment', ucommentSchema)
module.exports = Ucomment
