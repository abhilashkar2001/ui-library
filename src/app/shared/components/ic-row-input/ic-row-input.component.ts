import { Component, Input, OnInit } from "@angular/core";
import { AbstractControl, FormControl } from "@angular/forms";

@Component({
  selector: "app-ic-row-input",
  templateUrl: "./ic-row-input.component.html",
  styleUrls: ["./ic-row-input.component.scss"]
})
export class IcRowInputComponent implements OnInit {
  @Input("control") control: AbstractControl | any = new FormControl("");
  @Input("inputLabel") inputLabel: string | any;
  @Input("type") type: string | any;
  @Input("items") items: any[] | any;
  @Input("bindLabelKey") bindLabelKey: string | any;
  @Input("bindValueKey") bindValueKey: string | any;
  @Input("readonly") readonly: boolean | any;

  constructor() {}

  ngOnInit(): void {}

  get validator(): any {
    const validator = this.control.validator({} as AbstractControl);
    if (validator && validator.required) {
      return true;
    }
  }
}
