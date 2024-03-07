import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "app-common-level-status",
  templateUrl: "./common-level-status.component.html",
  styleUrls: ["./common-level-status.component.scss"],
})
export class CommonLevelStatusComponent implements OnInit {
  @Input() approvalList;

  constructor() {}

  ngOnInit(): void {}
}
