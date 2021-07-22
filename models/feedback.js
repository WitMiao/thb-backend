var mongoose = require('mongoose');
var feedSchema = require('../schemas/feedback');
var Feedback = mongoose.model('Feedback', feedSchema)
module.exports = Feedback
