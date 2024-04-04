const path = require('path')
const express = require('express')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const routes = require('./controllers')

const sequelize = require('./config/connection')
const SequelizeStore = require('connect-session-sequelize')(session.Store)

const app = express()
app.use(cookieParser());
const PORT = process.env.PORT || 4040

const sess = {
  secret: 'secret',
  cookie: {
    maxAge: 3600000,
    httpOnly: true,
    secure: false,
  },
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize
  })
}

app.use(session(sess))

app.use(express.json())
app.use(express.urlencoded({
  extended: true
}))
app.use(express.static(path.join(__dirname, 'public')))
app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/pages/index.html"))
);
app.get("/login", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/pages/login.html"))
);
app.get("/signup", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/pages/signup.html"))
);
app.get("/medications", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/pages/medications.html"))
);
app.get("/appointments", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/pages/appointments.html"))
);

app.use(routes)

sequelize.sync({force: false}).then(() => {
  app.listen(PORT, () => console.log('Now listening at port 4040'))
})