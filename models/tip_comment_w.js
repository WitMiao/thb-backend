var mongoose = require('mongoose');
var wcommentipSchema = require('../schemas/tip_comment_w');
var WCommentip = mongoose.model('WCommentip', wcommentipSchema)
module.exports = WCommentip
