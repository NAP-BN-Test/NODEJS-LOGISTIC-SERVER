let app = require('express')();
let server = require('http').createServer(app);

const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

let routes = require('./api/router') //importing route
routes(app)

const port = process.env.PORT || 3002

// server.listen(port, function () {
//     console.log('http://localhost:' + port);
// });
// server.listen(port, function () {
//     console.log('http://localhost:' + port);
// });
server.listen(port, function () {
    console.log('http://localhost:' + port);
});
