/**
* See https://poloniex.com/support/api/
* See https://github.com/premasagar/poloniex.js/blob/master/lib/poloniex.js
*/

// http://www.tgreenidge.com/blog/hide-api-keys/
var keys = require('./api_keys'); // contains json object called module.exports
console.log("key=" + keys.polo.key);
console.log("secret=" + keys.polo.secret);

var express      = require('express'); // Express web server framework
var request      = require('request'); // "Request" library
var querystring  = require('querystring'); //https://nodejs.org/api/querystring.html
var cookieParser = require('cookie-parser');
var app = express();
var Poloniex = require('./poloniex.js');

app.use(express.static(__dirname + '/public'))
   .use(cookieParser());

    // Generate headers signed by this user's key and secret.
    // The secret is encapsulated and never exposed
poloniex = new Poloniex(keys.polo.key, keys.polo.secret);

poloniex.getTicker(function(err, data){
    if (err){
        console.log('ERROR', err);
        return;
    }

    console.log(data);
});



function getReturnTicker() {
    var authOptions = {
        url: 'https://poloniex.com/public?command=returnTicker',
        headers: Poloniex(keys.polo.key, keys.polo.secret)
        
    };

    request.post(authOptions, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            var access_token = body.access_token;
            res.send({'access_token': access_token}); //send new access token to (index.html)
        }
    });
}



/*
///1. Request authorization
app.get('/login', function(req, res) {
    var state = generateRandomString(16);
    res.cookie(stateKey, state);

    var scope = 'user-read-private user-read-email';
    //request authorization
    res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
        response_type: 'code',
        client_id: client_id,
        scope: scope,
        redirect_uri: redirect_uri,
        state: state
    }));
});


///7. request access token from refresh token
app.get('/refresh_token', function(req, res) {
    var refresh_token = req.query.refresh_token;
    
    var authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        headers: {'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
        form: {
          grant_type: 'refresh_token',
          refresh_token: refresh_token
        },
        json: true
    };

    request.post(authOptions, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            var access_token = body.access_token;
            res.send({'access_token': access_token}); //send new access token to (index.html)
        }
    });
});
*/

app.listen(8888);
console.log('Listening on 8888');