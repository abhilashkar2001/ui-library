import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AdminLayoutComponent } from 'app/layouts/admin-layout/admin-layout.component';
import { CardSerivce } from 'app/modules/card/card.service';
import { OtpVerificationComponent } from 'app/shared/components/otp-verification/otp-verification.component';
import { SessionStorageService } from 'app/shared/services/session-storage.service';
import { catchError, map, of, tap } from 'rxjs';
// import { OtpVerificationComponent } from 'app/shared/components/otp-verification/otp-verification.component';

@Component({
  selector: 'app-payment-details',
  templateUrl: './payment-details.component.html',
  styleUrls: ['./payment-details.component.scss'],
})
export class PaymentDetailsComponent {
  cardsList = [
    {
      name: 'M-pesa',
      text: 'Secure and manage your funds easily with M-pesa during low balance situations',
    },
    {
      name: 'Cash',
      text: 'Pay with cash directly at the counter for a quick and easy transaction.',
    },
    {
      name: 'Account Debit',
      text: 'Amount is auto-debited from your account for smooth, hassle-free payments',
    },
  ];
  paymentDetailsForm!: FormGroup;
  countriesIsdCodes: any[] = [];
  accountNumbers: any = [];
  type!: string;

  constructor(
    private fb: FormBuilder,
    private adminLayout: AdminLayoutComponent,
    private sessionStorage: SessionStorageService,
    private cardService: CardSerivce,
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.type = this.sessionStorage.getTypeOfFlow();
  }
  buildForm() {
    this.paymentDetailsForm = this.fb.group({
      id: [],
      debitCardFee: [],
      services: [],
      isdCode: [''],
      mobile: [''],
      accountNumber: [''],
      overallAmount: ['75,000'],
    });
  }

  submitPaymentDetails() {
    // const contextData :ContainerContextData = {
    //   component: PdfViewerComponent,
    //   data: {
    //     fileName: 'payment-details.pdf',
    //     fileurl: 'payment-details.pdf'
    //   }
    // }
    // console.log('ffff', contextData);
    //  this.sidenavService.open(contextData);

    this.adminLayout.openSidenavComponent(OtpVerificationComponent, {});
  }

  cancelPaymentDetails() {}

  // Save method
  handleSubmit() {
    const payload = this.paymentDetailsForm.value;
    return this.cardService.saveCardPaymentDetails(payload).pipe(
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
    return this.handleSubmit().toPromise();
  }
}
