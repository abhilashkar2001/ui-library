import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ServiceCallHandler } from 'app/shared/service-call.handler';
import { ChequeService } from '../cheque-service';

@Component({
  selector: 'app-chequebook-request',
  templateUrl: './chequebook-request.component.html',
  styleUrls: ['./chequebook-request.component.scss'],
})
export class ChequebookRequestComponent implements OnInit {
  chequebookRequestForm!: FormGroup;
  customerInfo: any;
  accountNumberList: any[] = [];
  selectedAccInfo: any;

  chequeNumber: any;
  instrumentType: any;
  noOfLeaves: any;

  accountInfo: any;

  deliveryOptions: any[] = [
    { label: 'Branch Near Me', value: 'Branch Near Me' },
    { label: 'My Address', value: 'My Address' },
  ];
  branches: any[] = [];
  addressTypesList: any[] = [{ addressTypes: 'Communication Address' }];
  addressList: any[] = [];

  constructor(
    private fb: FormBuilder,
    private accountService: ChequeService,
    private serviceCallHandler: ServiceCallHandler,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.fetchGenericInfo();
    this.fetchCustomerInfo();
    this.buildRequestForm();
  }

  fetchGenericInfo() {
    this.accountService.fetchGeneric().subscribe((resp: any) => {
      this.noOfLeaves = resp?.data?.NOOFLEAVES;
      this.instrumentType = resp?.data?.INSTRUMENTTYPE?.find((i: any) =>
        i?.values?.toLowerCase()?.includes('cheque'),
      )?.id;
    });
  }

  fetchCustomerInfo() {
    const custInfo: any = sessionStorage.getItem('customer-Info');
    this.customerInfo = JSON.parse(custInfo);

    this.accountNumberList = JSON.parse(
      <string>sessionStorage.getItem('listOfAccounts'),
    );
  }
  buildRequestForm() {
    this.chequebookRequestForm = this.fb.group({
      accountNo: ['', [Validators.required]],
      leavesNo: [''],
      deliveryLocation: ['Branch Near Me'],
      branch: [''],

      type: [''],
      address1: [''],
      address2: [''],
      country: [''],
      state: [''],
      city: [''],
      pin: [''],
    });

    const selectedAccountNo = sessionStorage.getItem('selectAccNo');

    if (selectedAccountNo) {
      this.chequebookRequestForm.get('accountNo')?.setValue(selectedAccountNo);
      this.handleAccountNumberChange();
    }
  }

  handleAccountNumberChange() {
    this.selectedAccInfo = this.accountNumberList?.find(
      (i) =>
        i?.accountNo === this.chequebookRequestForm.get('accountNo')?.value,
    );

    this.accountService
      .getChequeNoByAccNo(this.chequebookRequestForm.get('accountNo')?.value)
      .subscribe(
        (resp) => {
          this.chequeNumber = resp?.data;
        },
        (err) => console.error('Error: ', err),
      );

    this.accountService
      .fetchInfoByoriginationAccNo(
        this.chequebookRequestForm.get('accountNo')?.value,
      )
      .subscribe(
        (resp: any) => {
          this.accountInfo = resp?.data[0];

          this.accountService
            .fetchBranches(this.accountInfo?.bankCode)
            .subscribe((res: any) => {
              this.branches = res?.data;
            });

          this.accountService
            .fetchAddress(this.accountInfo?.originationId)
            .subscribe((res: any) => {
              this.addressList = res?.data;
            });
        },
        (err) => console.error('Error: ', err),
      );
  }

  changeAddressType() {
    const selectedAddress = this.addressList?.[0];
    this.chequebookRequestForm
      .get('address1')
      ?.setValue(selectedAddress?.address1);
    this.chequebookRequestForm
      .get('address2')
      ?.setValue(selectedAddress?.address2);
    this.chequebookRequestForm
      .get('country')
      ?.setValue(selectedAddress?.countryName);
    this.chequebookRequestForm
      .get('state')
      ?.setValue(selectedAddress?.stateName);
    this.chequebookRequestForm.get('city')?.setValue(selectedAddress?.cityName);
    this.chequebookRequestForm.get('pin')?.setValue(selectedAddress?.pincode);
  }

  goBack() {
    this.router.navigate(['/user/dashboard']);
  }

  saveChequeDetails() {
    // const chequeDetails = resp?.data;
    const requestFormValue: any = this.chequebookRequestForm.value;
    const insPayload = {
      instrumentName: 'mobile banking cheque',
      branchNearMe: requestFormValue?.deliveryLocation === 'Branch Near Me',
      deliveryBranchCode: requestFormValue?.branch,
      accountBranch: this.selectedAccInfo?.accountBranch,
      instrumentType: this.instrumentType,
      accountNumber: requestFormValue?.accountNo,
      chequeBookNumber: this.chequeNumber,
      numberOfLeaves: requestFormValue?.leavesNo,
      // chequeDetails,
    };

    this.accountService.saveRequestChequeToInstrument(insPayload).subscribe(
      (resp: any) => {
        console.log('Saved Resp---- ', resp);
        const leaves = requestFormValue?.leavesNo;
        const leavesValues = this.noOfLeaves.find(
          (item: any) => item.id === leaves,
        );

        const paymentDetailsArr = [
          {
            eventType: 'chequeBookRequest',
            status: 'confirm',
            statusHeader: 'Comfirm Detail',
            statusNews: 'Request Summary',
            summary: [
              {
                header: 'Account Details',
                details: [
                  {
                    Name: this.customerInfo?.customerName,
                  },
                  {
                    'Account No': requestFormValue?.accountNo,
                  },
                  {
                    'Account Type':
                      this.customerInfo?.accounts?.[0]?.accountType,
                  },
                ],
              },
              {
                header: 'Cheque Book Detail',
                details: [
                  {
                    'No of Leaves Per Book': leavesValues?.values,
                  },
                ],
              },
              {
                header: 'Communication Address',
                details:
                  requestFormValue?.deliveryLocation === 'Branch Near Me'
                    ? [{ Branch: requestFormValue?.branch }]
                    : [
                        {
                          'Address Line 1': requestFormValue?.address1,
                        },
                        {
                          'Address Line 2': requestFormValue?.address2,
                        },
                        { Country: requestFormValue?.country },
                        { state: requestFormValue?.state },
                        { City: requestFormValue?.city },
                        { 'PIN Code': requestFormValue?.pin },
                      ],
              },
            ],
            qrToggle: false,
          },
        ];

        const revPayload = { id: resp?.data?.id };
        this.serviceCallHandler.put(
          'serviceHandler',
          revPayload,
          paymentDetailsArr,
          (revPayload) => this.accountService.auditLogRevisions(revPayload),
        );

        this.router.navigate(['user/dashboard/cheque/payment-summary']);
      },
      (err) => {
        console.error('Error: ', err);
      },
    );
    // }
    // this.accountService.saveChequeDetails(payload).subscribe(
    //   (resp) => {
    //     if (resp?.data) {
    //       const chequeDetails = resp?.data;
    //       const requestFormValue: any = this.chequebookRequestForm.value;
    //       const insPayload = {
    //         instrumentName: "mobile banking cheque",
    //         branchNearMe:
    //           requestFormValue?.deliveryLocation === "Branch Near Me",
    //         deliveryBranchCode: requestFormValue?.branch,
    //         accountBranch: this.selectedAccInfo?.accountBranch,
    //         instrumentType: this.instrumentType,
    //         accountNumber: requestFormValue?.accountNo,
    //         chequeBookNumber: this.chequeNumber,
    //         numberOfLeaves: requestFormValue?.leavesNo,
    //         chequeDetails,
    //       };

    //       this.accountService
    //         .saveRequestChequeToInstrument(insPayload)
    //         .subscribe(
    //           (resp: any) => {
    //             console.log("Saved Resp---- ", resp);

    //             let paymentDetailsArr = [
    //               {
    //                 eventType: "mmidTransfer",
    //                 status: "confirm",
    //                 statusHeader: "Comfirm Detail",
    //                 statusNews: "Payment sent successfully!",
    //                 summary: [
    //                   {
    //                     header: "Account Details",
    //                     details: [
    //                       {
    //                         Name: this.customerInfo?.customerName,
    //                       },
    //                       {
    //                         "Account No": requestFormValue?.accountNo,
    //                       },
    //                       {
    //                         "Account Type":
    //                           this.customerInfo?.accounts?.[0]?.accountType,
    //                       },
    //                     ],
    //                   },
    //                   {
    //                     header: "Cheque Book Detail",
    //                     details: [
    //                       {
    //                         "No of Cheque Book": 1,
    //                       },
    //                       {
    //                         "No of Leaves Per Book": requestFormValue?.leavesNo,
    //                       },
    //                     ],
    //                   },
    //                   {
    //                     header: "Communication Address",
    //                     details:
    //                       requestFormValue?.deliveryLocation ===
    //                       "Branch Near Me"
    //                         ? [{ Branch: requestFormValue?.branch }]
    //                         : [
    //                             {
    //                               "Address Line 1": requestFormValue?.address1,
    //                             },
    //                             {
    //                               "Address Line 2": requestFormValue?.address2,
    //                             },
    //                             { Country: requestFormValue?.country },
    //                             { state: requestFormValue?.state },
    //                             { City: requestFormValue?.city },
    //                             { "PIN Code": requestFormValue?.pin },
    //                           ],
    //                   },
    //                 ],
    //                 qrToggle: false,
    //               },
    //             ];

    //             const revPayload = { id: resp?.data?.id };
    //             this.serviceCallHandler.put(
    //               "serviceHandler",
    //               revPayload,
    //               paymentDetailsArr,
    //               (revPayload) =>
    //                 this.accountService.auditLogRevisions(revPayload)
    //             );

    //             this.router.navigate(["/account/payment-summary"]);
    //           },
    //           (err) => {
    //             console.error("Error: ", err);
    //           }
    //         );
    //     }
    //   },
    //   (err) => {
    //     console.error("Error: ", err);
    //   }
    // );
  }
}
