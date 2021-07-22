var mongoose = require('mongoose');
var lcommentipSchema = require('../schemas/tip_comment_l');
var LCommentip = mongoose.model('LCommentip', lcommentipSchema)
module.exports = LCommentip
