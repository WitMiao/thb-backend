var mongoose = require('mongoose');
var suggestSchema = require('../schemas/suggest');
var Suggest = mongoose.model('Suggest', suggestSchema)
module.exports = Suggest
