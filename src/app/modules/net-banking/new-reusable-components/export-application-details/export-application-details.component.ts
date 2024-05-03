import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { reference } from "@popperjs/core";

@Component({
  selector: "app-export-application-details",
  templateUrl: "./export-application-details.component.html",
  styleUrls: ["./export-application-details.component.scss"],
})
export class ExportApplicationDetailsComponent implements OnInit {
  applicationProcess: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.bulidForm();
  }

  bulidForm() {
    this.applicationProcess = this.fb.group({
      name: [""],
      customerCode: [""],
      address1: ["", Validators.required],
      address2: [""],
      country: ["", Validators.required],
      pinCode: ["", Validators.required],
      state: ["", Validators.required],
      city: ["", Validators.required],
      iecCode: [""],
      reference: [""],
    });
  }
}
