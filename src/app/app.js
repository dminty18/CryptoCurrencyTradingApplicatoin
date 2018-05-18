var express = require("express");
var currencyData = require('./currencies/CurrencyData')
var app = express();

const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

app.post('/api/addCurrency', function(req, res){
    let currencyServiceObj = new currencyData(req, res)
    currencyServiceObj.getCurrency()
})

app.get('/api/getCurrency', function(req, res){
    let currencyServiceObj = new currencyData(req, res)
    currencyServiceObj.addCurrency()
})


app.get("/", function(req, res){
    res.send("Hi There!");   
})

app.get("/bye", function(req, res){
    res.send("Goodbye!!!!");   
});

app.get("/dog", function(req, res){
    res.send("Woof!");   
});

app.listen(3000, function ()
{
    console.log("Web Service listening on port 3000")
});
