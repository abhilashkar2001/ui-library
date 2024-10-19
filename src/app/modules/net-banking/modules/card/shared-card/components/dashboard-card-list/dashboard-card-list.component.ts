import { Component, Input, OnInit } from "@angular/core";
import { Cards } from "app/shared/models/card.model";

@Component({
  selector: "app-dashboard-card-list",
  templateUrl: "./dashboard-card-list.component.html",
  styleUrls: ["./dashboard-card-list.component.scss"],
})
export class DashboardCardListComponent implements OnInit {
  @Input("title") title: string | undefined;
  @Input("cardList") cardList: Cards | undefined;

  constructor() {}

  ngOnInit(): void {}
}
