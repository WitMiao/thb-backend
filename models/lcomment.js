var mongoose = require('mongoose');
var lcommentSchema = require('../schemas/lcomment');
var Lcomment = mongoose.model('Lcomment', lcommentSchema)
module.exports = Lcomment
