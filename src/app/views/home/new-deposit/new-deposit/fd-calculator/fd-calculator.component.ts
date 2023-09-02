import { Component, OnInit } from "@angular/core";
import { NewDepositService } from "../../new-deposit.service";

@Component({
  selector: "app-fd-calculator",
  templateUrl: "./fd-calculator.component.html",
  styleUrls: ["./fd-calculator.component.scss"],
})
export class FdCalculatorComponent implements OnInit {
  constructor(private showSideBar: NewDepositService) {}

  ngOnInit(): void {
    this.showSideBar.setToken(true);
  }
}
