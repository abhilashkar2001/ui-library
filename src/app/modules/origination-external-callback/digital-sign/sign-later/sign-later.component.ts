import { Component, OnInit } from '@angular/core';
import { SignNowPopupComponent } from '../sign-now-popup/sign-now-popup.component';
import { BranchService } from '../sign-now-popup/branch.service';
import { SuccessModalComponent } from '../success-modal/success-modal.component';
import { SessionStorageService } from 'app/shared/services/session-storage.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-sign-later',
  templateUrl: './sign-later.component.html',
  styleUrls: ['./sign-later.component.scss'],
})
export class SignLaterComponent implements OnInit {
  signatureId: any;
  constructor(
    private dialog: MatDialog,
    private branchService: BranchService,
    private sessionStorageService: SessionStorageService,
  ) {}

  ngOnInit(): void {
    const dialogRef = this.dialog.open(SignNowPopupComponent, {
      disableClose: false,
      width: '60%',
      data: { signatureId: this.signatureId, title: 'Sign Now' },
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res?.result?.signatureId) {
        const signPayload = {
          originationId: this.sessionStorageService.getOriginationId(),
          signatureId: res?.result?.signatureId,
          screenCode: this.sessionStorageService.getScreenId(),
        };
        this.branchService
          .saveDigitalSignDetails(signPayload)
          .subscribe((result) => {
            if (result?.statusCode === 200 || result?.statusCode === 201) {
              const sucessDialog = this.dialog.open(SuccessModalComponent, {
                width: '40%',
                data: {
                  screenType: 'Sign Now',
                  title: 'Digital sign has been successfully recorded!',
                },
                disableClose: true,
              });
              sucessDialog.afterClosed().subscribe((_) => {
                setTimeout(() => {
                  window.close();
                }, 5000);
              });
            }
          });
      } else {
        window.close();
      }
    });
  }
}
