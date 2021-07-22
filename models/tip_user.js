var mongoose = require('mongoose');
var usertipSchema = require('../schemas/tip_user');
var Usertip = mongoose.model('Usertip', usertipSchema)
module.exports = Usertip
