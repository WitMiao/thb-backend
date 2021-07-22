//  用户点赞表
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;


var uzanSchema = new Schema({
	userid: {type:ObjectId, ref:'User'},
	zanlist:Array,
	total: {
		type:Number,
		default:0
	},
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
uzanSchema.pre('save', function(next){
	if(this.isNew){
		this.meta.createAt = this.meta.updateAt = Date.now()
	}else{
		this.meta.updateAt = Date.now()
	}
	next();
})
uzanSchema.statics = {
	fetch:function(cb){
		return this
		.find({})
		.exec(cb)
	},
	findById:function(userid, cb) {
		return this
		.find({userid: userid})
		.exec(cb)
	},
	zanAddById: function(id, zanvalue, cb){
		return this
		.updateOne({userid:id},{$inc:{total:1},$push:{zanlist:zanvalue}})
		.exec(cb)
	},
	zanReduceById:function(id, zanvalue, cb){
		return this
		.updateOne({userid:id},{$inc:{total:-1},$pull:{zanlist:zanvalue}})
		.exec(cb)
	}
}
module.exports = uzanSchema;