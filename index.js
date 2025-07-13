const express = require('express')
const app = express()
const port = 3000

// roteamentos
const router = require('./routes/index_router.js')
const userRouter = require('./routes/user_router.js')
const operacaoRouter = require('./routes/operacao_router.js')

// Templates
const expressLayouts = require('express-ejs-layouts')
app.set('views', 'views')
app.set('view engine', 'ejs')
app.use(expressLayouts);

// Public
app.use(express.static('public'))

// Middleware
app.use(express.urlencoded({ extended: false }))

// Session
var session = require('express-session')
const pgSession = require('connect-pg-simple')(session);
const pool = require('./db/postgres.js');

const sessionOptions = session({
  store: new pgSession({
    pool : pool, 
    tableName : 'session'  
  }),
  secret: process.env.SESSSION_SECRET,
  resave: false, // true se quiser que a sessao se renove mesmo com inatividade
  saveUninitialized: false, // true se quiser identificar visitantes recorrentes
  cookie: {
    maxAge: 1000 * 60 * 60, // valor em miliseconds - uma hora
    httpOnly: true
  }
})
app.use(sessionOptions)
app.use((req, res, next) => {
  res.locals.usuario = req.session.usuario
  next()
})

app.use('/', router)
app.use('/operacao', operacaoRouter)
app.use('/user', userRouter)

app.listen(port, () => {
    console.log(`Example app listening on http://localhost:${port}`)
})