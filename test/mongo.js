var config = {
  port: 3000,
  session: {
    secret: 'myblog',
    key: 'myblog',
    maxAge: 2592000000
  },
  mongodb: 'mongodb://localhost:27017/myblog'
}
import test from 'ava';
const Mongolass = require('mongolass')
const mongolass = new Mongolass()
mongolass.connect(config.mongodb)

var Person = mongolass.model('man', {
  name: { type: 'string', required: true },
  password: { type: 'string', required: true },
  gender: { type: 'string', enum: ['m', 'f', 'x'], default: 'x' },
  bio: { type: 'string', required: true }
})
Person.index({ name: 1 }, { unique: true }).exec()// 根据用户名找到用户，用户名全局唯一

const moment = require('moment')
const objectIdToTimestamp = require('objectid-to-timestamp')

// 根据 id 生成创建时间 created_at
mongolass.plugin('addCreatedAt', {
  afterFind: function (results) {
    results.forEach(function (item) {
      item.created_at = moment(objectIdToTimestamp(item._id)).format('YYYY-MM-DD HH:mm')
    })
    return results
  },
  afterFindOne: function (result) {
    if (result) {
      result.created_at = moment(objectIdToTimestamp(result._id)).format('YYYY-MM-DD HH:mm')
    }
    return result
  }
})

var PersonModel = {
  // 注册一个用户
  create: function create (person) {
    return Person.create(person).exec()
  },

  // 通过用户名获取用户信息
  getUserByName: function getUserByName (name) {
    return Person
      .findOne({ name: name })
      .addCreatedAt()
      .exec()
  }
}

test(async t => {
	 await PersonModel.create({name:"reco",password:"reco",gender:"m",bio:"..."})
	 var p = await PersonModel.getUserByName("reco")
	 t.is(p.name,"reco")
});
