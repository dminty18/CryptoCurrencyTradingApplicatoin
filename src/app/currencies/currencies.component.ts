import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/Rx';
import { Observer } from 'rxjs/Rx';
import {Subscription} from 'rxjs/Subscription';
import {Currency} from './currency.model';
import {Chart} from 'chart.js';


@Component({
  selector: 'app-currencies',
  templateUrl: './currencies.component.html',
  styleUrls: ['./currencies.component.css']
})
 
export class CurrenciesComponent  implements OnInit {
  public bidhide: boolean;
  public askhide: boolean;
  currencies: Currency[] = [new Currency('BCH-USD','BCHUSD',"Bitcoin Cash USD", this.http)];
  chart_GDAX_Bid = [];
  chart_GDAX_Ask = [];
  chart_Kraken_Bid = [];
  chart_Kraken_Ask = [];
  

constructor(private http: HttpClient) {}

ngOnInit(){
   this.bidhide =false;
   this.askhide = false;
    console.log(this.currencies);


 //  for (let x of this.currencies[0].GDAX_topfifty_orders['bids']){
  //    this.gdaxbidsonly.push(x[0]);
 // }


  this.chart_GDAX_Bid = new Chart('chart_GDAX_Bid',{
    type:'bar',
    tite: "GDAX Bid Spread",
    data: {
      labels: this.currencies[0].GDAX_bids_only_price,
      datasets: [{
        label: 'Bids',
        data: this.currencies[0].GDAX_bids_only_quant,
        backgroundColor: 'Red'
      }]
    } ,
    options: Chart.defaults.bar
    })

    this.chart_GDAX_Ask = new Chart('chart_GDAX_Ask',{
      type:'bar',
      tite: "GDAX Ask Spread",
      data: {
        labels: this.currencies[0].GDAX_asks_only_price,
        datasets: [{
          label: 'Asks',
          data: this.currencies[0].GDAX_asks_only_quant,
          backgroundColor: 'Blue'
        }]
      } ,
      options: Chart.defaults.bar
      })

      this.chart_Kraken_Bid = new Chart('chart_Kraken_Bid',{
        type:'bar',
        tite: "Kraken Bid Spread",
        data: {
          labels: this.currencies[0].Kraken_bids_only_price,
          datasets: [{
            label: 'Bids',
            data: this.currencies[0].Kraken_bids_only_quant,
            backgroundColor: 'Red'
          }]
        } ,
        options: Chart.defaults.bar
        })
    
        this.chart_Kraken_Ask = new Chart('chart_Kraken_Ask',{
          type:'bar',
          tite: "Kraken Ask Spread",
          data: {
            labels: this.currencies[0].Kraken_asks_only_price,
            datasets: [{
              label: 'Asks',
              data: this.currencies[0].Kraken_asks_only_quant,
              backgroundColor: 'Blue'
            }]
          } ,
          options: Chart.defaults.bar
          })




  }

  viewbid()
  {    
    this.bidhide = !this.bidhide;
  }

  viewask()
  {
    this.askhide = !this.askhide;
  }

}

