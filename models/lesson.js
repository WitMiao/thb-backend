var mongoose = require('mongoose');
var lessonSchema = require('../schemas/lesson');
var Lesson = mongoose.model('Lesson', lessonSchema)
module.exports = Lesson