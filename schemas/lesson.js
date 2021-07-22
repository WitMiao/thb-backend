// 在线课程表
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

var lessonSchema = new Schema({
	title:String,
	abstract:String,
	learnsome:String,
	knowsome:String,
	looks:{
		type:Number,
		default:0
	},
	covers:String,
	src:String,
	meta:{
		createAt: {
			type:Date,
			default: Date.now()
		},
		updateAt: {
			type: Date,
			default: Date.now()
		}
	}
})
lessonSchema.pre('save', function(next){
	if(this.isNew){
		this.meta.createAt = this.meta.updateAt = Date.now()
	}else{
		this.meta.updateAt = Date.now()
	}
	next();
})
lessonSchema.statics = {
	updateLooks:function(vid, cb) {
		return this
		.updateOne({_id: vid},{$inc:{looks:1}})
		.exec(cb)
	},
	updateVideo: function(vid, data, cb){
		return this
		.updateOne({_id:vid},{$set:{
			title:data.title,
			abstract:data.abstract,
			learnsome:data.learnsome,
			knowsome:data.knowsome,
			covers:data.covers,
			src:data.src
		}})
		.exec(cb)
	}
}
module.exports = lessonSchema;
