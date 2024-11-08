import { Component, Input, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Location } from "@angular/common";
import { CreateRdService } from "../../../rd-calculator/create-rd.service";
import { NewDepositService } from "app/modules/new-deposit/new-deposit.service";
import { InfoPopupComponent } from "../info-popup/info-popup.component";
import { MatDialog } from "@angular/material/dialog";
@Component({
  selector: "app-maturity-calculator",
  templateUrl: "./maturity-calculator.component.html",
  styleUrls: ["./maturity-calculator.component.scss"],
})
export class MaturityCalculatorComponent implements OnInit {
  @Input() fdName;
  @Input() calculatorValues;
  flexDetails = {
    maturityAmount: 10000,
    intrestRate: 1.9,
    maturityDate: "2023-02-21",
    autoRenew: false,
    dateOfInstalment: "2023-08-21",
  };
  url: string = "";
  constructor(
    private router: Router,
    private showSideBar: NewDepositService,
    private location: Location,
    private rdApi: CreateRdService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {}

  openDialog(): void {
    const dialogRef = this.dialog.open(InfoPopupComponent, {
      width: "700px",
      height: "400px",
    });
  }
  openLink(fdType) {
    let path;
    if (fdType == "FD") {
      path = "/deposits/fdFlow/fdDetails";
      this.url = this.location.prepareExternalUrl(
        this.router.serializeUrl(this.router.createUrlTree([path]))
      );
      window.open(`${this.url}`, "_blank");
    } else {
      var payload = {
        ...this.calculatorValues,
        amount: parseInt(this.calculatorValues.amount),
        ...this.flexDetails,
      };

      this.rdApi.updateRdDetails(payload).subscribe((resp) => {
        if (resp?.statusCode === 201) {
          sessionStorage.setItem(
            "recurringDepositId",
            resp.data.recurringDepositId
          );
          const id = resp?.data?.recurringDepositId
            ? resp?.data?.recurringDepositId
            : "";
          path = `/deposits/rdDeposit`;
          this.url = this.location.prepareExternalUrl(
            this.router.serializeUrl(this.router.createUrlTree([path]))
          );
          this.url = `${this.url}/${id}`;
          window.open(`${this.url}`, "_blank");
        }
      });
    }
  }
}
