var mongoose = require('mongoose');
var worktipSchema = require('../schemas/tip_work');
var Worktip = mongoose.model('Worktip', worktipSchema)
module.exports = Worktip
