import { Location } from "@angular/common";
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { CommonService } from "app/shared/services/common-service/common.service";
import { CibilScorePoorDialgComponent } from "../cibil-score-poor-dialg/cibil-score-poor-dialg.component";

@Component({
  selector: "app-cibil-score-result",
  templateUrl: "./cibil-score-result.component.html",
  styleUrls: ["./cibil-score-result.component.scss"],
})
export class CibilScoreResultComponent implements OnInit {
  dialogsaveRef!: MatDialogRef<CibilScorePoorDialgComponent>;
  @Input() flow: string;
  @Input() isDifferentMobile: boolean;
  @Output() onBackEvent: EventEmitter<any> = new EventEmitter();
  @Output() onBackFromCIBILscoreResult: EventEmitter<any> = new EventEmitter();
  @Output() onCibilConfirmEvent: EventEmitter<any> = new EventEmitter();
  cibilScore: number = 600;
  dataSource: any;
  cibilScoreList = [
    {
      score: "Below 681",
      description: "Need Help",
      colorCode: "#D57066",
    },
    {
      score: "681 - 730",
      description: "Average",
      colorCode: "#DF9690",
    },
    {
      score: "771 - 770",
      description: "Fair",
      colorCode: "#E4A037",
    },
    {
      score: "771 - 790",
      description: "Good",
      colorCode: "#62BB69",
    },
    {
      score: "Above 791",
      description: "Excellent",
      colorCode: "#D57066",
    },
  ];

  constructor(
    private router: Router,
    private location: Location,
    private dialog: MatDialog,
    private commonService: CommonService
  ) {
    this.dataSource = {
      chart: {
        // caption: "Your CIBIL Score is",
        // "subcaption": "Last week",
        // "lowerLimit": "0",
        // "upperLimit": "900",
        showToolTip: "0",
        theme: "fusion",
      },
      colorRange: {
        color: [
          {
            minValue: "0",
            maxValue: "681",
            code: "#ff0000",
          },
          {
            minValue: "682",
            maxValue: "730",
            code: "#f78e8e",
          },
          {
            minValue: "731",
            maxValue: "770",
            code: "#ffa600",
          },
          {
            minValue: "771",
            maxValue: "790",
            code: "#21ac21",
          },
          {
            minValue: "791",
            maxValue: "900",
            code: "#006400",
          },
        ],
      },
      dials: {
        dial: [
          {
            value: "695",
          },
        ],
      },
    };
  }

  ngOnInit(): void {
    this.cibilScore = this.getCibliScore();
    this.dataSource.dials.dial[0]["value"] = this.cibilScore;
  }

  getCibliScore() {
    return 700;
  }

  cibilScoreText() {
    if (this.cibilScore < 681) {
      return "Poor";
    } else if (this.cibilScore > 681 && this.cibilScore <= 730) {
      return "Average";
    } else if (this.cibilScore > 730 && this.cibilScore <= 770) {
      return "Fair";
    } else if (this.cibilScore > 770 && this.cibilScore <= 790) {
      return "Good";
    } else {
      return "Excellent";
    }
  }

  onBack() {
    this.onBackEvent.emit();
  }

  onContinue() {
    console.log(this.cibilScore);
    this.onCibilConfirmEvent.emit();
    // if (this.cibilScore < 600) {
    //   this.dialogsaveRef = this.dialog.open(CibilScorePoorDialgComponent, {
    //     data: {
    //       applicationNo: 746764326432,
    //     },
    //     width: "700px",
    //     height: "500px",
    //     disableClose: true,
    //     panelClass: "popup-dialog-class",
    //     backdropClass: "bdrop",
    //   });
    //   this.dialogsaveRef.componentInstance.submitClicked.subscribe((result) => {
    //     // for different mobile resetting flag
    //     this.commonService.isUserUsingDifferentMobile(false);
    //     this.router.navigate(["/"]);
    //   });
    // } else if (this.flow === "cards") {
    //   this.onConfirmEvent.emit();
    // } else {
    //   this.onConfirmEvent.emit();
    // }
  }
}
