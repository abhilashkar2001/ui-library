import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NewErrorPopupComponent } from 'app/modules/home/new-error-popup/new-error-popup.component';
import { SessionStorageService } from 'app/shared/services/session-storage.service';
import { CardService } from '../../card.service';
import {
  MatDialogRef,
  MatDialog,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';

@Component({
  selector: 'app-get-statement-popup',
  templateUrl: './get-statement-popup.component.html',
  styleUrls: ['./get-statement-popup.component.scss'],
})
export class GetStatementPopupComponent implements OnInit {
  getStatementForm!: FormGroup;
  creditCardDetails: any;
  monthList = [
    { id: 1, value: 'Jan', label: 'Jan' },
    { id: 2, value: 'Feb', label: 'Feb' },
    { id: 3, value: 'Mar', label: 'Mar' },
    { id: 4, value: 'Apr', label: 'Apr' },
    { id: 5, value: 'May', label: 'May' },
    { id: 6, value: 'June', label: 'June' },
    { id: 7, value: 'Jul', label: 'Jul' },
    { id: 8, value: 'Aug', label: 'Aug' },
    { id: 9, value: 'Sep', label: 'Sep' },
    { id: 10, value: 'Oct', label: 'Oct' },
    { id: 11, value: 'Nov', label: 'Nov' },
    { id: 12, value: 'Dec', label: 'Dec' },
  ];
  yearList = [
    { id: 1, value: '2024', label: '2024' },
    { id: 2, value: '2023', label: '2023' },
    { id: 3, value: '2022', label: '2022' },
    { id: 4, value: '2021', label: '2021' },
  ];
  formatList = [{ id: 1, value: 'PDF', label: 'PDF' }];

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<GetStatementPopupComponent>,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private downloadCardService: CardService,
    private ss: SessionStorageService,
  ) {}

  ngOnInit() {
    this.creditCardDetails = this.ss.getListOfCards();
    this.buildStatementForm();
  }

  buildStatementForm() {
    this.getStatementForm = this.formBuilder.group({
      month: [''],
      year: [''],
      format: [''],
    });
  }
  downLoad() {
    if (this.getStatementForm.valid) {
      console.log(this.getStatementForm);
      console.log(this.getStatementForm.value);
      const month: number = this.getStatementForm.get('month')?.value;
      const year: number = this.getStatementForm.get('year')?.value;
      this.downloadCardService
        .downloadCreditInfoAsPdf(
          this.creditCardDetails?.[0]?.cardNumber,
          month,
          year,
        )
        .subscribe(
          (res: Blob) => {
            if (res !== null) {
              this.downloadFile(res);
            }
          },
          (errorResponse) => {
            this.errorPopUp(errorResponse);
          },
        );
    }
  }

  downloadFile(blobData: Blob): void {
    const blob = new Blob([blobData], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'credit_info.pdf';
    link.click();
    window.URL.revokeObjectURL(url);
  }

  // openPopUp() {
  //   const dialogRef = this.dialog.open(SuccessPopupComponent, {
  //     data: "File Downloaded successfully",
  //     panelClass: "custom-popup-container",
  //   });
  //   dialogRef.afterClosed().subscribe((result) => {
  //     console.log(result);
  //   });
  // }

  errorPopUp(res: any) {
    const errPayload = {
      error: res?.error,
      message: res?.message,
      statusCode: res?.status,
    };
    this.dialog.open(NewErrorPopupComponent, {
      width: '45%',
      height: '50%',
      disableClose: true,
      data: {
        type: 'customError',
        errPayload,
      },
    });
  }

  close() {
    this.dialogRef.close();
  }
}
