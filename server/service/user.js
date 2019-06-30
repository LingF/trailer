const mongoose = require('mongoose')
const User = mongoose.model('User')

export const checkPassword = async (email, password) => {
  let match = false
  const user = await User.findOne({ email })

  if (user) {
    // comparePassword user的实例方法 见 database/schema/user.js
    match = await user.comparePassword(password, user.password)
  }

  return {
    match,
    user
  }
}