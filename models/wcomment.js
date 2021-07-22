var mongoose = require('mongoose');
var wcommentSchema = require('../schemas/wcomment');
var Wcomment = mongoose.model('Wcomment', wcommentSchema)
module.exports = Wcomment
