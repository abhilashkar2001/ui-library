import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";

@Component({
  selector: "app-net-banking-home",
  templateUrl: "./net-banking-home.component.html",
  styleUrls: ["./net-banking-home.component.scss"],
})
export class NetBankingHomeComponent implements OnInit {
  public approvalForm: FormGroup;

  approvalList = [
    { level: "Level 0", user: "Abhilash", status: "Approved" },
    { level: "Level 1", user: "Abhilash", status: "Approved" },
    { level: "Level 2", user: "Abhilash", status: "Rejected" },
  ];

  constructor() {}

  ngOnInit(): void {}
}
