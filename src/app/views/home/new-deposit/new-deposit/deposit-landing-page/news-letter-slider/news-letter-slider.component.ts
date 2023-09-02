import { Component, OnInit } from "@angular/core";
import { NewDepositConstant } from "../../new-deposit.constant";

@Component({
  selector: "app-news-letter-slider",
  templateUrl: "./news-letter-slider.component.html",
  styleUrls: ["./news-letter-slider.component.scss"],
})
export class NewsLetterSliderComponent implements OnInit {
  images = NewDepositConstant.CLIENT_DESCRIPTION;

  constructor() {}

  ngOnInit(): void {}
}
