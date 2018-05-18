import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/Rx';
import { Observer } from 'rxjs/Rx';
import {Subscription} from 'rxjs/Subscription';

export class Currency {

    public GDAXticker: string = 'Blank';
    public Krakenticker: string = "Blank";
    public description: string = 'Blank';
    
    private gdaxOrderBookSubscription: Subscription
    public GDAXprice_bid: number;
    public GDAXprice_ask: number;
    public GDAX_topfifty_orders: any[] =[];
    public GDAX_topfifty_bids: any;
    public GDAX_topfifty_asks: any;
    public GDAX_maker_fees = [[0,0],[50000,0],[100000,0]];
    public GDAX_taker_fees = [[0,.30],[50000,.30],[100000,.30]];
    public GDAX_bids_only_price: any[] = [];
    public GDAX_bids_only_quant: any[] = [];
    public GDAX_asks_only_price: any[] = [];
    public GDAX_asks_only_quant: any[] = [];
    

    private KrakenOrderBookSubscription: Subscription
    public Krakenprice_bid: number;
    public Krakenprice_ask: number;
    public Kraken_topfifty_orders: any;
    public Kraken_fees: any;
    public Kraken_maker_fees  = [[0,.16],[50000,.14],[100000,.12]];
    public Kraken_taker_fees = [[0,.26],[50000,.24],[100000,.22]];
    public Kraken_bids_only_price: any[] = [];
    public Kraken_bids_only_quant: any[] = [];
    public Kraken_asks_only_price: any[] = [];
    public Kraken_asks_only_quant: any[] = [];

    public Scenario_buy_price: number;
    public Scenario_buy_exchange: string;
    public Scenario_buy_taker_fee: number;
    public Scenario_buy_taker_amount: number;
    
    public Scenario_sell_price: number;
    public Scenario_sell_exchange: string;
    public Scenario_sell_taker_fee: number;
    public Scenario_sell_taker_amount: number;

    public Scenario_profit: number;

    constructor(GDAXticker: string, Krakenticker: string, description: string, private http: HttpClient) {
        this.GDAXticker = GDAXticker;
        this.Krakenticker = Krakenticker;
        this.description = description;
        this.getKrakenData();
        this.getGdaxData();
        this.getBestScenario();
    }

    getGdaxData(){
        this.gdaxOrderBookSubscription = this.http.get('https://api.gdax.com/products/' + this.GDAXticker + '/book?level=2').subscribe(
            (data: any)=> {
                console.log(data);
                this.GDAXprice_bid = data['bids'][0][0];
                this.GDAXprice_ask = data['asks'][0][0];
                this.GDAX_topfifty_orders = data;
                console.log(this.GDAX_topfifty_orders);

                data['bids'].forEach(x => {
                    this.GDAX_bids_only_price.push(x[0]);
                    this.GDAX_bids_only_quant.push(x[1]);
                });
                
                data['asks'].forEach(x => {
                    this.GDAX_asks_only_price.push(x[0]);
                    this.GDAX_asks_only_quant.push(x[1]);
                });

              },
            (error: string) =>{console.log("Error");},
            () => {console.log('completed'); }
            );

            
            
    }

    getKrakenData(){
        this.KrakenOrderBookSubscription = this.http.get('https://api.kraken.com/0/public/Depth?pair=' + this.Krakenticker + '&count=50').subscribe(
            (Krakendata: number)=> {
                console.log(Krakendata);
                this.Krakenprice_bid = Krakendata['result'][this.Krakenticker]['bids'][0][0];
                this.Krakenprice_ask = Krakendata['result'][this.Krakenticker]['asks'][0][0];
                this.Kraken_topfifty_orders = Krakendata['result'][this.Krakenticker];
                console.log(this.Kraken_topfifty_orders);

                Krakendata['result'][this.Krakenticker]['bids'].forEach(x => {
                    this.Kraken_bids_only_price.push(x[0]);
                    this.Kraken_bids_only_quant.push(x[1]);
                });
                
                Krakendata['result'][this.Krakenticker]['asks'].forEach(x => {
                    this.Kraken_asks_only_price.push(x[0]);
                    this.Kraken_asks_only_quant.push(x[1]);
                });


              },
            (error: string) =>{console.log("Error");},
            () => {console.log('completed'); }
            );
        
            console.log(this.Kraken_topfifty_orders);
    
        this.KrakenOrderBookSubscription = this.http.get('https://api.kraken.com/0/public/AssetPairs?pair=' + this.Krakenticker).subscribe(
            (Kraken_fees: number)=> {
                console.log(Kraken_fees);
                this.Kraken_fees = Kraken_fees['result'][this.Krakenticker];
                console.log(this.Kraken_fees);
              },
            (error: string) =>{console.log("Error");},
            () => {console.log('completed'); }
            );    
        }


        getBestScenario(){

            //Determine Buy Price
            if(10<11)
                {this.Scenario_buy_exchange = 'GDAX';
                this.Scenario_buy_price = this.GDAXprice_bid ;
                this.Scenario_buy_taker_fee = this.GDAX_taker_fees[0][1];
                this.Scenario_buy_taker_amount = (this.Scenario_buy_taker_fee/100) * this.Scenario_buy_price;
            }else{
                this.Scenario_buy_exchange = 'Kraken';
                this.Scenario_buy_price = this.Krakenprice_ask;
                this.Scenario_buy_taker_fee = this.Kraken_taker_fees[0][1];
                this.Scenario_buy_taker_amount = ((this.Scenario_buy_taker_fee/100) * this.Scenario_buy_price);
            }
    
            //Determine Sell Price
            if(this.GDAXprice_bid>this.Krakenprice_bid)
                {this.Scenario_sell_exchange = 'GDAX';
                this.Scenario_sell_price = this.GDAXprice_bid * 1;
                this.Scenario_sell_taker_fee = this.GDAX_taker_fees[0][1];
                this.Scenario_sell_taker_amount = (this.Scenario_sell_taker_fee/100) * this.Scenario_sell_price;
            
            }else{
                this.Scenario_sell_exchange = 'Kraken';
                this.Scenario_sell_price = this.Krakenprice_bid;
                this.Scenario_sell_taker_fee = this.Kraken_taker_fees[0][1];
                this.Scenario_sell_taker_amount = (this.Scenario_sell_taker_fee/100) * this.Scenario_sell_price;
            }   
            
            this.Scenario_profit = this.Scenario_sell_price - this.Scenario_sell_taker_amount - this.Scenario_buy_taker_fee - this.Scenario_buy_price;
              
        }
    
    
    
}