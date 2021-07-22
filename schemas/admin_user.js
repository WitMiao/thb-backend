// 后台管理员表
var mongoose = require('mongoose');
var adminuserSchema = new mongoose.Schema({
	username:{
		type:String,
		unique: true,
    	require: true 
	},
	password:{
	    type: String,
	    require: true
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
adminuserSchema.pre('save', function(next){
	if(this.isNew){
		this.meta.createAt = this.meta.updateAt = Date.now()
	}else{
		this.meta.updateAt = Date.now()
	}
	next();
})
adminuserSchema.statics = {
	fetch:function(cb){
		return this
		.find({})
		.exec(cb)
	},
	fetchByName:function(username, cb){
		return this
		.find({username: username})
		.exec(cb)
	},
	fetchById:function(userid, cb){
		return this
		.find({_id: userid})
		.exec(cb)
	},
	updateById:function(userid, newpwd, cb){
		return this
		.updateOne({_id:userid},{$set:{
			'password':newpwd
		}})
		.exec(cb)
	}

}
module.exports = adminuserSchema