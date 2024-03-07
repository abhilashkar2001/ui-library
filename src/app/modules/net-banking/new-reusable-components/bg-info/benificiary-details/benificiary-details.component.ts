import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "app-benificiary-details",
  templateUrl: "./benificiary-details.component.html",
  styleUrls: ["./benificiary-details.component.scss"],
})
export class BenificiaryDetailsComponent implements OnInit {
  @Input() benificiaryDetailsForm: FormGroup;
  @Input() componentName: string = "";

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {}

  onSave() {
    console.log("on save benificiary");
  }
}
