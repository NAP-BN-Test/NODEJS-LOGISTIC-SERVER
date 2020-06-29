module.exports = {
    checkEmail: async function (email) { //take this list for dropdown
        var request = require('request')
        var post_options = {
            url: `https://apilayer.net/api/check?access_key=a69834eab18e99ec484e9410a47bce5b&email=${email}`,
            method: 'GET',
            json: true
        };

        await request.get(post_options, function (err, result, bodyrq) {
            if (err) {
                console.log(err)
                return Promise.resolve(false);
            }
            if (bodyrq) {
                return Promise.resolve(bodyrq.smtp_check);
            }
        });
    },

}