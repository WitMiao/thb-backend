// 举报 作品表
let mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

let worktipSchema = new Schema({
	fromid: {type:ObjectId, ref:'User'},
	toid: {type:ObjectId, ref:'Works'},
	content:String,
	createAt:String,
	status:{
		type:Number,
		default:0
	},
	meta:{
		createAt: {
			type:Date,
			default: Date.now()
		}
	}
})
worktipSchema.statics = {
	updateById:function(id, cb){
		return this
		.updateOne({_id: id},{$set:{status:1}})
		.exec(cb)
	}
}
module.exports = worktipSchema