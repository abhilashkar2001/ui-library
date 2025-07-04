import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TermsConditionPopupComponent } from 'app/shared/components/terms-condition-popup/terms-condition-popup.component';
import { LoanService } from 'app/shared/services/loan/loan.service';
import { SessionStorageService } from 'app/shared/services/session-storage.service';
import { catchError, map, of, tap } from 'rxjs';

@Component({
  selector: 'app-terms-condition',
  templateUrl: './terms-condition.component.html',
  styleUrls: ['./terms-condition.component.scss'],
})
export class TermsConditionComponent {
  customerDetails: any = [
    {
      headerDef: 'customerName',
      headerCell: 'Name',
    },
    {
      headerDef: 'mobileNo',
      headerCell: 'Mobile No',
    },
    {
      headerDef: 'applicationDate',
      headerCell: 'Date',
    },
    {
      headerDef: 'loanAmount',
      headerCell: 'Loan Amount',
    },
  ];
  agreed = false;

  constructor(
    private dialog: MatDialog,
    private loanService: LoanService,
    private sessionStorageService: SessionStorageService,
  ) {}

  openDialog() {
    const dialogRef = this.dialog.open(TermsConditionPopupComponent, {
      height: '80%',
      width: '50%',
      panelClass: 'custom-dialog',
    });
    dialogRef.afterClosed().subscribe((res: string) => {
      console.log(res);
      if (res == 'agree') this.agreed = true;
    });
  }

  handleSubmit() {
    if (!this.agreed) return;
    const payload = {
      creditChecked: this.agreed,
      originationId: this.sessionStorageService.getOriginationId(),
      screenCode: '444',
    };

    return this.loanService.saveTermsandCreditFields(payload).pipe(
      tap((res) => {
        console.log(res);
      }),
      map((res) =>
        res?.statusCode == 200 || res?.statusCode == 201
          ? ('success' as const)
          : ('failure' as const),
      ),
      catchError((_err) => {
        console.error(_err);
        return of('failure' as const);
      }),
    );
  }

  submitForm() {
    return this.handleSubmit()?.toPromise();
  }
}
