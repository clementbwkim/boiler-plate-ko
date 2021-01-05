//백엔드 서버 시작시 시작점

const express = require('express') //
const app = express() //function을 이용해서 새로운 express app을 만들고 
const port = 5000
const bodyParser = require('body-parser');
const { User } = require('./models/User');

//application/x-www-form-urlencoded :: 이렇게 된 데이터를 분석해서 가져올 수 있게 한다
app.use(bodyParser.urlencoded({extended: true}));
//application/json :: json 타입으로 된 것을 분석해서 가져올 수 있게 한다.
app.use(bodyParser.json());

const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://clem:tots2626@youtubeclone.fjpbe.mongodb.net/<dbname>?retryWrites=true&w=majority', {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB Connected...'))
  .catch((err) => console.log(err))


app.get('/', (req, res) => { //app을 get하고 루트 디렉토리에 오면 
  res.send('Hello World! 안녕하세요~~')  //Hello World를 출력되게 한다
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




app.listen(port, () => {  //app이 port 5000을 실행을 하는 것 
  console.log(`Example app listening at http://localhost:${port}`)
})