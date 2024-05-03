import { Component, Input, OnInit } from "@angular/core";
import { AbstractControl, FormControl } from "@angular/forms";

@Component({
  selector: "app-ic-row-input",
  templateUrl: "./ic-row-input.component.html",
  styleUrls: ["./ic-row-input.component.scss"],
})
export class IcRowInputComponent implements OnInit {
  @Input("control") control: AbstractControl = new FormControl("");
  @Input("inputLabel") inputLabel: string;
  @Input("type") type: string;
  @Input("items") items: any[];
  @Input("bindLabelKey") bindLabelKey: string;
  @Input("bindValueKey") bindValueKey: string;
  @Input("readonly") readonly: boolean;

  constructor() {}

  ngOnInit(): void {}

  get validator() {
    const validator = this.control.validator({} as AbstractControl);
    if (validator && validator.required) {
      return true;
    }
  }
}
