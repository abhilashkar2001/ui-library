import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-dob-verification",
  templateUrl: "./dob-verification.component.html",
  styleUrls: ["./dob-verification.component.scss"],
})
export class DobVerificationComponent implements OnInit {
  dateOfBirth: string;
  constructor() {}

  ngOnInit(): void {}
}
