import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { OtpVerificationComponent } from 'app/shared/components/otp-verification/otp-verification.component';
import {
  ContainerContextData,
  SidenavService,
} from 'app/shared/services/sidenav.service';

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

  constructor(
    private fb: FormBuilder,
    private sidenavService: SidenavService,
  ) {}

  ngOnInit(): void {
    this.buildForm();
  }
  buildForm() {
    this.paymentDetailsForm = this.fb.group({
      paymentMethod: [null],
      isdCode: [''],
      accountNumber: [''],
      phone: [''],
      amount: ['75,000'],
    });
  }

  submitPaymentDetails() {
    const contextData: ContainerContextData = {
      component: OtpVerificationComponent,
      data: 3,
    };
    console.log('ffff', contextData);
    this.sidenavService.open(contextData);
  }

  cancelPaymentDetails() {}
}
