var session = require('express-session')
var cookieParser = require('cookie-parser')

let app = require('express')();
let server = require('http').createServer(app);
let cors = require('cors');

const bodyParser = require('body-parser');


app.use(cookieParser())

app.use(session({
    name: 'user_sid',
    secret: '00a2152372fa8e0e62edbb45dd82831a',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 600000,
        maxAge: 3000000,
        sameSite: true,
        secure: true,
        httpOnly: true
    }
}))

app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

let routes = require('./api/router') //importing route
routes(app)

const port = process.env.PORT || 3302

server.listen(port, function () {
    console.log('http://localhost:' + port);
});
