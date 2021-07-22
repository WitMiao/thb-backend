var mongoose = require('mongoose');
var icomment = require('../schemas/index_comment');
var Icomment = mongoose.model('Icomment', icomment)
module.exports = Icomment
