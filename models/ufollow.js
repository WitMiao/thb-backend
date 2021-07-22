var mongoose = require('mongoose');
var ufollowSchema = require('../schemas/ufollow');
var Ufollow = mongoose.model('Ufollow', ufollowSchema)
module.exports = Ufollow
