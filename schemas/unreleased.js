// 未完成项目表
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;


var unrelSchema = new Schema({
	user: {type:ObjectId, ref:'User'},
	localsname:String,
	title:String,
	time:String,
	covers:String,
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
unrelSchema.pre('save', function(next){
	if(this.isNew){
		this.meta.createAt = this.meta.updateAt = Date.now()
	}else{
		this.meta.updateAt = Date.now()
	}
	next();
})
unrelSchema.statics = {
	updateById:function(localsid,title,localsname,covers, cb){
		return this
		.updateOne({_id: localsid},{$set:{
			title:title,
			localsname:localsname,
			covers:covers,
			'meta.updateAt':Date.now()
		}})
		.exec(cb)
	}
}
module.exports = unrelSchema;
