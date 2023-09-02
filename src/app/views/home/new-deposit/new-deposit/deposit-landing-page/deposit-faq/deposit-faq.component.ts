import { Component, OnInit } from "@angular/core";
import { NewDepositConstant } from "../../new-deposit.constant";

@Component({
  selector: "app-deposit-faq",
  templateUrl: "./deposit-faq.component.html",
  styleUrls: ["./deposit-faq.component.scss"],
})
export class DepositFaqComponent implements OnInit {
  faqArray = NewDepositConstant.DEPOSITFAQ;

  constructor() {}

  ngOnInit(): void {}
}
