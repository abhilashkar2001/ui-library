import { Component, OnInit } from "@angular/core";
import { TopPerformingConstant } from "./top-performing.constant";

@Component({
  selector: "app-top-performing",
  templateUrl: "./top-performing.component.html",
  styleUrls: ["./top-performing.component.scss"],
})
export class TopPerformingComponent implements OnInit {
  panelOpenState: boolean = false;
  closeOthers: boolean = false;
  stocks = TopPerformingConstant.STOCKS;
  isStocksIsReadMore: boolean = false;
  moneyMarket = TopPerformingConstant.MONEY_MARKET;
  isMoneyMarketReadMore: boolean = false;

  constructor() {}

  ngOnInit(): void {}
}
