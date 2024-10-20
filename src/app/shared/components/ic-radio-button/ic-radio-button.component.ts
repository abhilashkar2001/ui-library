import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { AbstractControl } from "@angular/forms";

@Component({
  selector: "app-ic-radio-button",
  templateUrl: "./ic-radio-button.component.html",
  styleUrls: ["./ic-radio-button.component.scss"],
})
export class IcRadioButtonComponent implements OnInit {
  @Input("control") control: AbstractControl;
  @Input("optiions") optiions: any[];
  @Input("labelClass") labelClass: string;
  @Input("displayLabel") displayLabel: string;
  @Input("layout") layout: any = "row";
  @Input("radiolayout") radiolayout: any = "row";
  @Input("gap") gap: string | number = 10;

  @Output() change = new EventEmitter();
  constructor() {}

  ngOnInit(): void {}

  onChaage(e) {
    console.log(e);
  }
}
