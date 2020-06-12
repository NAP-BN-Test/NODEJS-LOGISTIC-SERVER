
const Op = require('sequelize').Op;
const Constant = require('../constants/constant');
const Result = require('../constants/result');

var database = require('../db');

var mModule = require('../constants/modules');

module.exports = {
    unSubscribe: (req, res) => {
        let body = req.body;

        console.log(body);


        res.json("ok")
    },

}
