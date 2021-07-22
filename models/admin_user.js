var mongoose = require('mongoose');
var adminuserSchema = require('../schemas/admin_user');
var Adminuser = mongoose.model('Adminuser', adminuserSchema)
module.exports = Adminuser
