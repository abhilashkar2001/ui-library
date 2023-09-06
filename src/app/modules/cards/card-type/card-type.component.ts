import { Location } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { CommonService } from "app/shared/services/common-service/common.service";

@Component({
  selector: "app-card-type",
  templateUrl: "./card-type.component.html",
  styleUrls: ["./card-type.component.scss"],
})
export class CardTypeComponent implements OnInit {
  tab: number = 1;

  constructor(
    private router: Router,
    private commonService: CommonService,
    private location: Location
  ) {}

  cards = [
    { image: "../../../../assets/images/bluecard.png" },
    { image: "../../../../assets/images/bluecard.png" },
    { image: "../../../../assets/images/bluecard.png" },
    { image: "../../../../assets/images/bluecard.png" },
  ];

  ngOnInit(): void {
    //please dont'remove from here
    this.updateCurrentRoute();
  }

  updateCurrentRoute() {
    this.commonService.updateData(this.router.url);
  }

  selectedTab(tab: number) {
    this.tab = tab;
  }

  onCardDelete(index: number) {
    this.cards.splice(index, 1);
  }

  onBack() {
    this.location.back();
  }
}
