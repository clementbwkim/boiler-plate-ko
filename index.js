//백엔드 서버 시작시 시작점

const express = require('express') //
const app = express() //function을 이용해서 새로운 express app을 만들고 
const port = 5000
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')

const config = require('./config/key');
const { User } = require('./models/User');

//application/x-www-form-urlencoded :: 이렇게 된 데이터를 분석해서 가져올 수 있게 한다
app.use(bodyParser.urlencoded({extended: true}));
//application/json :: json 타입으로 된 것을 분석해서 가져올 수 있게 한다.
app.use(bodyParser.json());
app.use(cookieParser());

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB Connected...'))
  .catch((err) => console.log(err))


app.get('/', (req, res) => { //app을 get하고 루트 디렉토리에 오면 
  res.send('Hello World! 안녕하세요~~ 감사합니다..')  //Hello World를 출력되게 한다
})


app.post('/register', (req, res) => {
  //회원가입할 때 필요한 정보들을 client에서 가져오면 
  //그것들을 데이터베이스에 넣어준다.

  const user = new User(req.body);
  user.save((err, userInfo) => {
    if(err) return res.json({ success: false, err })
    return res.status(200).json({ //status 200은 성공을 의미 
      success: true
    })
  })
});

app.post('/login', (req, res) => {

  //요청된 이메일을 db에 있는 지 찾는다 
  User.findOne({ email: req.body.email }, (err, user) => {

    if(!user) {
      return res.json({
        loginSuccess: false,
        message: '일치하는 이메일을 가진 유저가 없습니다!'
      })
    }
    
    //요청된 이메일이 db에 있다면 비밀번호가 일치하는지 확인한다 
    user.comparePassword(req.body.password, (err, isMatch) => {
      if(!isMatch) 
        return res.json({ loginSuccess: false, message: '비밀번호가 틀렸습니다!' })

      //비밀번호도 맞다면 토큰을 생성한다
      user.generateToken((err, user) => { 
        if(err) return res.status(400).send(err);

        //토큰을 저장한다. 어디에? 쿠키 or 로컬스토리지
        res.cookie('x-auth', user.token)
        .status(200)
        .json({ loginSuccess: true, userId: user._id })
        
      })
    })
  })



})




app.listen(port, () => {  //app이 port 5000을 실행을 하는 것 
  console.log(`Example app listening at http://localhost:${port}`)
})