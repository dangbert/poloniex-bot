/**
* See https://poloniex.com/support/api/
* Max 6 calls/sec, don't repeatedly and needlessly fetch excessive amounts of data.
*/

//TODO: make bot look for price differences and capatilize on them
// e.g. if ETH/USDT -> $17.98 and ETH/BTC -> BTC/USDT -> $18.40

// http://www.tgreenidge.com/blog/hide-api-keys/
var keys = require('./api_keys'); // contains json object called module.exports

var express      = require('express');
var request      = require('request');
var querystring  = require('querystring');
var cookieParser = require('cookie-parser');
var app = express();
var Poloniex = require('./poloniex.js');
var args = process.argv.slice(2);

var buy_price = parseFloat(args[1])   // price to buy ETH at
var sell_price = parseFloat(args[2]) // price to sell ETH at
const quantity = 0.97         // later consider using the max amount each time (include cumulative profits)
var inc = 0

var ready = 1                 // indicate that no API requests are still being made
var count = 0;                // number of times the loop has run
var numOrders = 0;            // number of orders made
var buying = 0                // 1 if the current goal is to buy Eth, 0 if the goal is to sell

if (args.length != 3) {
    console.log("3 command line args required");
    return;
}
if ((args[0] != "SELL" && args[0] != "BUY") || isNaN(buy_price) || isNaN(sell_price) || buy_price >= sell_price) {
    console.log("valid command line args required");
    return;
}

if (args[0] == "BUY") {
    buying = 1;
}

console.log("initialized buying = " + buying);
console.log(buy_price + " to " + sell_price);


app.use(express.static(__dirname + '/public'))
   .use(cookieParser());

// Generate headers signed by this user's key and secret.
poloniex = new Poloniex(keys.polo.key, keys.polo.secret);

app.listen(8888);
console.log("listening on 8888");


// print current balances
// (doesn't include balances on orders)
poloniex.myBalances(function(err, data) {
    console.log("...checking my balances");
    if (err || data.error) {
        console.log('ERROR', err);
        console.log(data);
        return;
    }
    var num_eth = parseFloat(data.ETH);
    var num_usdt = parseFloat(data.USDT);
    console.log("   " + num_eth + " eth");
    console.log("   " + num_usdt + " usdt");

	startLoop();
});


function startLoop() {
	// every 15 seconds
	var loop = setInterval(function() {
		count = count + 1;

		if (ready) {
            tick();
		}

		if (numOrders >= 20) {
			console.log("stopping after " + numOrders + " orders");
			clearInterval(loop);
		}
	}, 15 * 1000);
}



// poloniex API rate limit: 6 calls per second
// TODO: keep fees in mind
// checks all necessary conditions once and place a buy or sell order if appropriate
function tick() {
	ready = 0;
    if (count % 20 == 0 || count == 1) {
        console.log("\n\n-------- tick --------");
        console.log("buying = " + buying);
        console.log("looped:\t" + count + " times");
        console.log("orders made:\t" + numOrders);
    }

    poloniex.myOpenOrders("USDT", "ETH", function(err, data) {
        if (err || data.error) {
            console.log('ERROR', err);
            console.log(data);
            return;
        }

        if (count == 1) {
            console.log("open orders: " + data.length);
            console.log(data);
        }

        if (data.length > 0) {
            ready = 1; // important
            return;
        }
        // when there are no open orders, make a new order
        console.log("...now there are " + data.length + " open orders");

        // TODO: handle if there's an error when buying/selling
        if (buying) {
            placeBuyOrder(); // place ETH buy order
            buy_price += inc
            sell_price += inc
        }

        // if selling is the goal
        else {
            placeSellOrder(); // place ETH sell order
        }

    });
}


function checkPrice() {
    console.log("checkPrice() called");
    poloniex.getTicker(function(err, data) {
        if (err || data.error) {
            console.log('ERROR', err);
            console.log(data);
            return;
        }

        console.log("\n___USDT_ETH:___");
        console.log(data.USDT_ETH);
        var eth_price = -1

        if (buying)
            eth_price = parseFloat(data.USDT_ETH.lowestAsk);
        else
            eth_price = parseFloat(data.USDT_ETH.highestBid);

        console.log("data:::");
        console.log(data);
    });
}


// buy some ETH!
// this has a fee of 0.15%
function placeBuyOrder() {
	numOrders++; // doesn't necessarily mean the order worked
    console.log("*** PLACING BUY ORDER ***");

    poloniex.buy("USDT", "ETH", buy_price, quantity, function(err, data) {
		buying = 0;
		ready = 1;
        if (err || data.error) {
            console.log('ERROR', err);
            console.log(data);
            return;
        }
        console.log("   buy order placed at " + buy_price);
        console.log(data);
    });
}

// sell some ETH!
// this has a fee of 0.25%
// I believe poloniex will automatically sell at the highest buy order price
// if the given rate is less
function placeSellOrder() {
	numOrders++; // doesn't necessarily mean the order worked
    console.log("*** PLACING SELL ORDER ***");

    poloniex.sell("USDT", "ETH", sell_price, quantity, function(err, data) {
		buying = 1;
		ready = 1;
        if (err || data.error) {
            console.log('ERROR', err);
            console.log(data);
            return;
        }
        console.log("   sell order placed at " + sell_price);
        console.log(data);
    });
}
