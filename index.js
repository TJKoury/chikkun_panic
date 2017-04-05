var Gdax = require('gdax');
var publicClient = new Gdax.PublicClient();
var wc = new Gdax.WebsocketClient(['LTC-USD']);
var order_types=[ 'received', 'open', 'done', 'match' ];
var line = new Array(50).join("-");
var request = require('request');
var segwit = "";
var hodlings = parseFloat(process.argv[1])||(()=>{try{return parseFloat(require('fs').readFileSync('./hodlings.txt', {encoding:'utf8'}))}catch(e){}})()||0;

var analysis = function(data) { 
    if(order_types.indexOf(data.type)<0){
        order_types.push(data.type);
    }
    if((data.type === 'done')&&data.reason!=="canceled"&&data.hasOwnProperty('price')){

        if(data.price){
            console.log(line);
            console.log("Price:    ", data.price);
            console.log("Hodlings: ", (data.price*hodlings).toFixed(2));
            console.log(segwit);
        }        
    }
}

var _req = function(){
    require('request')('http://litecoinblockhalf.com/segwit.php', function (error, response, body) {
                segwit = "SEGWIT:    " + body.match(/\([\d\.]{5}%\)/g)[0].replace(/[\(\)]*/g, "");
    })
}
_req();
setInterval(_req, 5 * 60 * 1000);

wc.on('message', analysis);
