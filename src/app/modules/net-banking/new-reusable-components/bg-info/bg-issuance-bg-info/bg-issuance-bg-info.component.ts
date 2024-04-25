import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "app-bg-issuance-bg-info",
  templateUrl: "./bg-issuance-bg-info.component.html",
  styleUrls: ["./bg-issuance-bg-info.component.scss"],
})
export class BgIssuanceBgInfoComponent implements OnInit {
  @Input() bgIssuanceBgInfoForm: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {}
}
