/* 用户 */
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId
const SALT_WORK_FACTOR = 10 // 越大越复杂
const MAX_LOGIN_ATTEMPTS = 5 // 最大密码错误次数
const LOCK_TIME = 2 * 60 * 60 * 1000 // 锁定时间

const userSchema = new Schema({
  name: {
    unique: true, // 唯一
    required: true, // 必传
    type: String
  },
  email: {
    unique: true,
    required: true,
    type: String
  },
  password: {
    unique: true,
    type: String
  },
  loginAttepts: {
    type: Number,
    required: true,
    default: 0
  },
  lockUntil: Number,
  meta: {
    createdAt: {
      type: Date,
      default: Date.now()
    },
    updateAt: {
      type: Date,
      default: Date.now()
    }
  }
})

// 记录错误次数，不需实时记录到mongo，利用虚拟字段
userSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now())
})

// 保存之前，做额外的处理
userSchema.pre('save', function(next) {
  // 某个字段没有修改则跳过
  // this = user
  if (!this.isModified('password')) return next()
  // 掺入盐
  bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
    if (err) return next(err)
    // hash
    bcrypt.hash(user.password, salt, (error, hash) => {
      if (error) return next(error)

      this.password = hash
      next()
    })
  })
  // 判断是否为新数据
  if (this.isNew) {
    this.meta.createdAt = this.meta.updateAt = Date.now()
  } else {
    this.meta.updateAt = Date.now()
  }

  next()
})

// 实例方法
userSchema.methods = {
  // 比较
  // _password 提交的明文 password
  comparePassword: (_password, password) => {
    return new Promise((resolve, reject) => {
      bcrypt.compare(_password, password, (err, isMatch) => {
        if (!err) return next(isMatch)
        else erject(err)
      })
    })
  },
  // 判断当前用户超出登录次数
  // 频繁登录
  incLoginAttepts: (user) => {
    return new Promise((resolve, reject) => {
      if (this.lockUntil && this.lockUntil < Date.now()) {
        this.update({
          $set: {
            loginAttepts: 1
          },
          $unset: {
            lockUntil: 1
          }
        }, (err) => {
          if (!err) resolve(true)
          else reject(err)
        })
      } else {
        let updates = {
          $inc: {
            loginAttepts: 1
          }
        }

        // 锁定状态下且超出尝试次数
        if (this.loginAttepts + 1 >= MAX_LOGIN_ATTEMPTS && !this.isLocked) {
          updates.$set = {
            lockUntil: Date.now() + LOCK_TIME
          }
        }

        this.update(updates, err => {
          if (!err) resolve(true)
          else reject(err)
        })
      }
    })
    
  }
}

// 参数：模型名字，发布生成所需要的 Schema
mongoose.model('User', userSchema)