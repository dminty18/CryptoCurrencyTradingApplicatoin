var express = require("express");
var app = express();

/*
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
*/

const Gdax = require('gdax');
const publicClient = new Gdax.PublicClient('https://api.gdax.com');
const websocket = new Gdax.WebsocketClient(['BTC-USD', 'ETH-USD']);
const assert = require('assert');

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

app.set("view engine", "ejs")


app.get("/", function(req, res){
    res.send("Hi There!"); })


app.get("/gdaxdata", function(req, res){
    publicClient.getProductOrderBook('BTC-USD', {level:2}, function(error, response, data){
        if(!error && response.statusCode == 200){
           //var results = JSON.parse(data);
            res.send(data['bids'][0][0]);
        }
    })
})     
  
// app.get("/gdaxorderbook", function(req, res){
//     const orderbook = new Gdax.Orderbook();
//     orderbook.
// })


 app.listen(3000, function (){
    console.log("Web Service listening on port 3000")
    });

/*
//Level 2 Order Book - Top 50 Bids and Asks



MongoClient.connect(url, function(err, db){
    if (err) throw err;
    var dbo = db.db("cryptocurrency");
    dbo.collection("BTC_collection").find().toArray(function(err,result){
        if (err) throw err;
        console.log(result);
        db.close;
    }); 
});







/*
const orderbookSync = new Gdax.OrderbookSync(['BTC-USD', 'ETH-USD']);
console.log(orderbookSync.books['ETH-USD'].state());
console.log(orderbookSync.books['ETH-USD'])




websocket.on('message',data =>{
    console.log(data);
})




const myProductCallback = (err, response, data) =>{
    console.log(data);
    };
    



publicClient.getProducts(myProductCallback);
*/