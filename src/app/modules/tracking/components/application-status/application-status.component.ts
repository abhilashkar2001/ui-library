import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-application-status",
  templateUrl: "./application-status.component.html",
  styleUrls: ["./application-status.component.scss"],
})
export class ApplicationStatusComponent implements OnInit {
  summaryInfoResp = [
    {
      date: "20 Feb",
      process: "Application Submitted",
      dateAndTime: "20-09-23 | 01:23PM",
      description: "dfkj fsjn sdkjndk sdiunds iu  diusdnd  h.",
      status: "Done",
    },
    {
      date: "26 Feb",
      process: "Application Submitted",
      dateAndTime: "20-09-23 | 01:23PM",
      description: "dfkj fsjn sdkjndk sdiunds iu  diusdnd  h.",
      status: "Done",
    },
    {
      date: "19 March",
      process: "Application Inprogress",
      dateAndTime: "20-09-23 | 01:23PM",
      description: "dfkj fsjn sdkjndk sdiunds iu  diusdnd  h.",
      status: "Schedule",
    },
    {
      date: "26 Feb",
      process: "Application Submitted",
      dateAndTime: "20-09-23 | 01:23PM",
      description: "dfkj fsjn sdkjndk sdiunds iu  diusdnd  h.",
      status: "In Progress",
    },
  ];

  constructor() {}

  ngOnInit(): void {}
}
