import { Component } from '@angular/core';
import { TopPerformingConstant } from './top-performing.constant';

@Component({
  selector: 'app-top-performing',
  templateUrl: './top-performing.component.html',
  styleUrls: ['./top-performing.component.scss'],
})
export class TopPerformingComponent {
  panelOpenState = false;
  stocks = TopPerformingConstant.STOCKS;
  isStocksIsReadMore = false;
  moneyMarket = TopPerformingConstant.MONEY_MARKET;
  isMoneyMarketReadMore = false;
}
