import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { SignNowPopupComponent } from "../sign-now-popup/sign-now-popup.component";
import { BranchService } from "../sign-now-popup/branch.service";
import { SuccessModalComponent } from "../success-modal/success-modal.component";
import { Router } from "@angular/router";

@Component({
  selector: "app-sign-later",
  templateUrl: "./sign-later.component.html",
  styleUrls: ["./sign-later.component.scss"],
})
export class SignLaterComponent implements OnInit {
  signatureId: any;
  constructor(
    private dialog: MatDialog,
    private branchService: BranchService,
    private route: Router
  ) {}

  ngOnInit(): void {
    const dialogRef = this.dialog.open(SignNowPopupComponent, {
      disableClose: false,
      width: "60%",
      data: { signatureId: this.signatureId, title: "Sign Now" },
    });
    dialogRef.afterClosed().subscribe((res) => {
      console.log(res);

      if (res?.result?.signatureId) {
        const signPayload = {
          originationId: JSON.parse(sessionStorage.getItem("originationId")),
          signatureId: res?.result?.signatureId,
        };
        this.branchService
          .saveDigitalSignDetails(signPayload)
          .subscribe((result) => {
            if (result?.statusCode === 200 || result?.statusCode === 201) {
              const sucessDialog = this.dialog.open(SuccessModalComponent, {
                width: "40%",
                data: {
                  screenType: "Sign Now",
                  title: "Digital sign has been successfully recorded!",
                },
                disableClose: true,
              });
              sucessDialog.afterClosed().subscribe((res) => {
                this.route.navigate(["/home"]);
              });
            }
          });
      }
    });
  }
}
