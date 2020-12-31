const mongoose = require('mongoose')
const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 50
  },
  email: {
    type: String,
    trim: true, //오타로 들어간 space를 없애주는 역할 ex) clem kim@hotmail.com
    unique: true
  },
  password: {
    type: String,
    minlength: 5
  },
  lastname: {
    type: String,
    maxlength: 50
  },
  role: {
    type: Number,
    default: 0
  },
  image: String,
  token: { //유효성검사시 필요
    type: String
  },
  tokenExp: {
    type: Number
  }
})
                           //이 모델의 이름, 스키마의 이름 
const User = mongoose.model('User', userSchema)
module.exports = { User } //다른 곳에서도 쓰기 위해 exports 