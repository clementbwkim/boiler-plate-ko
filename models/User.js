const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

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


userSchema.pre('save', function( next ) {
  //userSchema를 가리킨다 
  let user = this;

  //비밀번호를 암호화시킨다
  if(user.isModified('password')) {
    bcrypt.genSalt(saltRounds, function(err, salt) {
      if(err) return next(err)
      //user.password :: plainpassword
      bcrypt.hash(user.password, salt, function(err, hash) {
        if(err) return next(err)
        user.password = hash
        next()
      })  
    })
  }else { //else 문이 없으면 if절이 실행되고나서 아니면 if절이 성립이 안된다면 여기 loop에 머물게 된다
    next();
  }
})

userSchema.methods.comparePassword = function(plainPassword, callbckfn) {

  //plainPassword 12345, 암호화된 비밀번호 $2b$10$LZn/2BSSSgu2K3jEui3J0.H9qz4OWHds06ESZEZ4y03FnjIMl0eSe
  bcrypt.compare(plainPassword, this.password, function(err, isMatch) {
    if(err) return callbckfn(err),
    callbckfn(null, isMatch)
  })
}

userSchema.methods.generateToken = function(callbckfn) {
  //jsonwebtoken을 이용해서 토큰을 생성하기
  let user = this;

  const token = jwt.sign(user._id.toHexString(), 'secretToken')
  // user._id + 'secretToken' = token
  // ->
  // 'secretToken' -> user._id

  user.token = token
  user.save((err, user) => {
    if(err) return callbckfn(err)
    callbckfn(null, user)
  })

} 

                           //이 모델의 이름, 스키마의 이름 
const User = mongoose.model('User', userSchema)
module.exports = { User } //다른 곳에서도 쓰기 위해 exports 