/**
* See https://poloniex.com/support/api/
* Max 6 calls/sec, don't repeatedly and needlessly fetch excessive amounts of data.
*/

// http://www.tgreenidge.com/blog/hide-api-keys/
var keys = require('./api_keys'); // contains json object called module.exports

var express      = require('express');
var request      = require('request');
var querystring  = require('querystring');
var cookieParser = require('cookie-parser');
var app = express();
var Poloniex = require('./poloniex.js');

const mid = 19.4
const sell_price = mid + 0.15
const buy_price = mid - 0.15
var buying = 1 // 1 if the goal is to buy Eth, 0 if the goal is to sell

app.use(express.static(__dirname + '/public'))
   .use(cookieParser());

app.listen(8888);
console.log("listening on 8888");


// Generate headers signed by this user's key and secret.
poloniex = new Poloniex(keys.polo.key, keys.polo.secret);

// doesn't include balances on orders
poloniex.myBalances(function(err, data) {
    console.log("...checking my balances");
    if (err) {
        console.log('ERROR', err);
        return;
    }
    var num_eth = parseFloat(data.ETH);
    var num_usdt = parseFloat(data.USDT);
    console.log("   " + num_eth + " eth");
    console.log("   " + num_usdt + " usdt");
    tick();

});



// TODO: find poloniex API rate limit
// checks all necessary conditions once and place a buy or sell order if appropriate
function tick() {
    console.log("\n\n-------- tick --------");
    poloniex.myOpenOrders("USDT", "ETH", function(err, data) {
        console.log("...checking my open orders");
        if (err) {
            console.log('ERROR', err);
            return;
        }

        if (data.length > 0) {
            console.log(data);
            console.log("   there are " + data.length + " open orders");
            return;
        }
        console.log("   there are NO open orders");


        // when there are no open orders
        if (buying) {
            // place buy order
            placeBuyOrder();

        }

        else { // if selling
            // place sell order
            placeSellOrder();

        }


    });
}


function checkPrice() {
    console.log("checkPrice() called");
    poloniex.getTicker(function(err, data) {
        if (err) {
            console.log('ERROR', err);
            return;
        }

        console.log("\n___USDT_ETH:___");
        console.log(data.USDT_ETH);
        var eth_price = -1

        if (buying)
            eth_price = parseFloat(data.USDT_ETH.lowestAsk)
        else
            eth_price = parseFloat(data.USDT_ETH.highestBid)

    });
}


function placeBuyOrder() {
    console.log("*** PLACING BUY ORDER ***");
}

function placeSellOrder() {
    console.log("*** PLACING SELL ORDER ***");
}

