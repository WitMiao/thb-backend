var mongoose = require('mongoose');
var banner = require('../schemas/banner');
var Banner = mongoose.model('Banner', banner)
module.exports = Banner
