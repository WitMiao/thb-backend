var mongoose = require('mongoose');
var unrelSchema = require('../schemas/unreleased');
var Unrel = mongoose.model('Unrel', unrelSchema)
module.exports = Unrel
