import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { SignNowPopupComponent } from "../sign-now-popup/sign-now-popup.component";
import { BranchService } from "../sign-now-popup/branch.service";
import { SuccessModalComponent } from "../success-modal/success-modal.component";
import { SessionStorageService } from "app/shared/services/session-storage.service";
import { OriginationService } from "app/shared/services/origination.service";

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
    private sessionStorageService: SessionStorageService,
    private originationService: OriginationService
  ) {}

  ngOnInit(): void {
    const dialogRef = this.dialog.open(SignNowPopupComponent, {
      disableClose: false,
      width: "60%",
      data: { signatureId: this.signatureId, title: "Sign Now" },
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res?.result?.signatureId) {
        const signPayload = {
          originationId: JSON.parse(sessionStorage.getItem("originationId")),
          signatureId: res?.result?.signatureId,
        };
        this.branchService
          .saveDigitalSignDetails(signPayload)
          .subscribe((result) => {
            if (result?.statusCode === 200 || result?.statusCode === 201) {
              let payload = {
                originationId: this.sessionStorageService.getOriginationId(),
                status: "CONFIRMED",
                userName: "WEBSITE",
                department: "CUSTOMER",
                remarks: "Upload signature",
                code: "REVSIGN",
                nextDepartment: "SALES DEPARTMENTS",
              };
              this.saveUpdate(payload);
              const sucessDialog = this.dialog.open(SuccessModalComponent, {
                width: "40%",
                data: {
                  screenType: "Sign Now",
                  title: "Digital sign has been successfully recorded!",
                },
                disableClose: true,
              });
              sucessDialog.afterClosed().subscribe((res) => {
                window.close();
              });
            }
          });
      } else {
        window.close();
      }
    });
  }

  saveUpdate(payload) {
    this.originationService
      .updateApprovalStatus(payload)
      .subscribe((res: any) => console.log(res));
  }
}
