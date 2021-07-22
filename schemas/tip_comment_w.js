// 举报 作品评论表
let mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
// comid 是回复的id
let wcommentipSchema = new Schema({
	fromid: {type:ObjectId, ref:'User'},
	toid: {type:ObjectId, ref:'Wcomment'},
	comid: String,
	content:String,
	diff:String,
	status:{
		type:Number,
		default:0
	},
	createAt:String,
	meta:{
		createAt: {
			type:Date,
			default: Date.now()
		}
	}
})


wcommentipSchema.statics = {
	removeById:function(id, cb){
		return this
		.deleteOne({_id: id})
		.exec(cb)
	},
	updateStatus:function(id, _status, cb){
		return this
		.updateOne({_id:id},{$set:{status:_status}})
		.exec(cb)
	}
}
module.exports = wcommentipSchema