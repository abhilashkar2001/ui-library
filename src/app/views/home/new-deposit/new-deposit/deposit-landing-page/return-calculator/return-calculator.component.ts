import { Component, Input, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";

@Component({
  selector: "app-return-calculator",
  templateUrl: "./return-calculator.component.html",
  styleUrls: ["./return-calculator.component.scss"],
})
export class ReturnCalculatorComponent implements OnInit {
  max = 100000;
  min = 1000;
  ammountValue = 0;
  @Input() fdName;
  ammount = new FormControl("");
  email = new FormControl("");
  thumbLabel: boolean = true;
  constructor() {}

  ngOnInit(): void {}
}
