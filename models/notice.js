var mongoose = require('mongoose');
var noticeSchema = require('../schemas/notice');
var Notice = mongoose.model('Notice', noticeSchema)
module.exports = Notice
