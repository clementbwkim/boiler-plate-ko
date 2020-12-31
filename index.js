//백엔드 서버 시작시 시작점

const express = require('express') //
const app = express() //function을 이용해서 새로운 express app을 만들고 
const port = 5000

const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://clem:tots2626@youtubeclone.fjpbe.mongodb.net/<dbname>?retryWrites=true&w=majority', {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB Connected...'))
  .catch((err) => console.log(err))


app.get('/', (req, res) => { //app을 get하고 루트 디렉토리에 오면 
  res.send('Hello World! 안녕하세요~~')  //Hello World를 출력되게 한다
})

app.listen(port, () => {  //app이 port 5000을 실행을 하는 것 
  console.log(`Example app listening at http://localhost:${port}`)
})