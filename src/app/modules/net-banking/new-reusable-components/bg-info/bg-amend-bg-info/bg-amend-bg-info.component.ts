import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "app-bg-amend-bg-info",
  templateUrl: "./bg-amend-bg-info.component.html",
  styleUrls: ["./bg-amend-bg-info.component.scss"],
})
export class BgAmendBgInfoComponent implements OnInit {
  @Input() bgAmendBgInfoForm: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {}
}
