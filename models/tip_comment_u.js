var mongoose = require('mongoose');
var ucommentipSchema = require('../schemas/tip_comment_u');
var UCommentip = mongoose.model('UCommentip', ucommentipSchema)
module.exports = UCommentip
