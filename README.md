Right now the code only buys/sells between ETH and USDT.

I make no guarantees about the behavior of the code but it has worked fine for me so far.

If you want to run the code (note this will make trades for you on poloniex):

* install node js
* create a poloniex.com account and generate API keys there
* rename sample_api_keys.js to api_keys.js and place your API keys in there
* "const quantity" in app.js is the amount of ETH to buy/sell and you have to manually change that before running app.js
* Start the bot:
  * node app.js <buy_price> <sell_price> <initial_mode>
  * the intial mode specifies whether to start by placing an ETH SELL order or BUY order
  * examples:
    * node app.js 367 390 SELL
    * node app.js 367 390 BUY
* A status will be outputed every 30 mins so you know it's still running.


The important code is all in app.js (poloniex.js is a library I downloaded from https://github.com/premasagar/poloniex.js)

(Ignore the public folder it's not being used)
