import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  GenericValueData,
  GenericValueInfoModel,
} from 'app/shared/models/generic-value.model';
import { GenericValueService } from 'app/shared/services/generic-value.service';
import { SidenavService } from 'app/shared/services/sidenav.service';
import { SessionStorageService } from 'app/shared/services/session-storage.service';

import {
  catchError,
  finalize,
  forkJoin,
  map,
  of,
  Subscription,
  tap,
} from 'rxjs';
import { Store } from '@ngrx/store';
import { LocaleData, selectLocaleData } from '@onerumango/utils';
import { CountryService } from 'app/shared/services/country-service';
import { AccountService } from 'app/shared/services/account.service';
import { pluckOnlyDate } from 'app/shared/helpers/utils';
import { ReusablePincodePopupComponent } from 'app/shared/components/reusable-pincode-popup/reusable-pincode-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { PersonalDetailsConstant } from 'app/modules/origination/modules/dynamic-pages/common-personal-details/personal-details.constant';

@Component({
  selector: 'app-personal-details',
  templateUrl: './personal-details.component.html',
  styleUrls: ['./personal-details.component.scss'],
})
export class AccountPersonalDetailsComponent implements OnInit {
  originationId: number | undefined;
  @Input() basisId: any;
  @Input() docCustomerDetails: any;
  private localeData: LocaleData | undefined;
  subscriptions: Subscription[] = [];
  personalDetails: any;
  todayDate: Date = new Date();
  defaultIsdCodeValue: any;
  showSpouseSection: boolean[] = [];
  staticData = PersonalDetailsConstant.GENERIC_SATIC_KEYS;
  genderArray: GenericValueInfoModel[] = [];
  prefixArray: GenericValueInfoModel[] = [];
  empoymentArray: GenericValueInfoModel[] = [];
  relationArray: GenericValueInfoModel[] = [];
  statementOptionArr: GenericValueInfoModel[] = [];
  residenceTypeArray: GenericValueInfoModel[] = [];
  maritalStatusArray: GenericValueData[] = [];
  boundaries: any;
  dobMinDate: Date | any;
  dobMaxDate: Date | any;
  countryArray: any;
  countriesIsdCodes: any;
  nationalityArray: any;
  maxMobileLength: any;
  customerDetailsForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private genericValueService: GenericValueService,
    public sidenavService: SidenavService,
    private sessionStorageService: SessionStorageService,
    private store: Store,
    private countryService: CountryService,
    private accountService: AccountService,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.originationId = this.sessionStorageService.getOriginationId();
    const localeData$ = this.store.select(selectLocaleData).subscribe((res) => {
      if (res) {
        this.localeData = res;
      }
    });
    this.subscriptions.push(localeData$);
    this.getGenericDetails();
    this.fetchBoundaries();
    this.getAllRequisite().then(() => {
      if (!this.personalDetails) {
        this.buildPersonalDetailsForm();
      }
    });

    if (this.originationId) {
      this.accountService
        .getAccountDetails(this.originationId)
        .pipe(
          finalize(() => {
            this.buildPersonalDetailsForm(this.personalDetails);
          }),
        )
        .subscribe({
          next: (resp) => {
            this.personalDetails = resp?.data?.customerInfo || null;
            if (this.personalDetails) {
              this.getGenericDetails();
            }
          },
        });
    }
    // let acc = localStorage.getItem('account-type');
    // this.detailsForGeneric.accountType = acc !== null ? acc : 'individual';
    // this.createAccordian();
  }

  async getAllRequisite() {
    return new Promise((resolve) => {
      forkJoin({
        countries: this.countryService.getCountries(),
      }).subscribe(
        (res: any) => {
          this.getCountry(res.countries);
          resolve('done');
        },
        () => {
          resolve('Fail');
        },
      );
    });
  }

  getGenericDetails() {
    this.genericValueService
      .loadGenericValue(Object.keys(this.staticData))
      .subscribe((resp: any) => {
        if (resp?.statusCode === 200) {
          this.staticData = resp.data;
          // this.genderArray = resp.data['GENDER'];
          // this.prefixArray = resp.data['PREFIX'];
          // this.residenceTypeArray = resp.data['RESIDENCETYPE'];
          // this.maritalStatusArray = resp.data['MARITALSTATUS'];
          // this.empoymentArray = resp.data['EMPLOYMENTTYPE'];
          // this.relationArray = resp.data['RELATIONSHIPTYPE'];
          // this.statementOptionArr = resp.data['COMMUNICATIONTYPE'];
        }
      });
  }

  fetchBoundaries() {
    this.accountService
      .fetchBoundariesDetails(this.basisId ?? 24878)
      .subscribe((res: any) => {
        if (res?.statusCode === 200 && res?.data) {
          this.boundaries = res.data[0];
          const minimumAge = this.boundaries.minimumAge ?? 0;
          const maximumAge = this.boundaries.maximumAge ?? 0;

          this.dobMaxDate = new Date(
            this.todayDate.getFullYear() - maximumAge,
            this.todayDate.getMonth(),
            this.todayDate.getDate(),
          );

          this.dobMinDate = new Date(
            this.todayDate.getFullYear() - minimumAge,
            this.todayDate.getMonth(),
            this.todayDate.getDate(),
          );
        }
      });
  }

  getCountry(resp?: any) {
    if (resp?.statusCode === 200) {
      if (resp?.data.length > 0) {
        this.countryArray = resp?.data;
        resp?.data?.forEach((element: any) => {
          if (element.nationality != null) this?.nationalityArray.push(element);
        });
        this.countriesIsdCodes = resp?.data;
        const indiaIsdCode = this.countriesIsdCodes.find(
          (item: any) => item?.countryName == this.localeData?.country,
        );
        if (indiaIsdCode) {
          this.defaultIsdCodeValue = indiaIsdCode?.countryTelIsdCode;
          this.maxMobileLength = indiaIsdCode?.mobileLength;
        } else {
          this.defaultIsdCodeValue =
            this.countriesIsdCodes[0].countryTelIsdCode;
          this.maxMobileLength = this.countriesIsdCodes[0]?.mobileLength;
        }
      }
    }
  }

  buildPersonalDetailsForm(data?: any) {
    this.customerDetailsForm = this.fb.group({
      customer: this.fb.array([]),
    });

    if (data?.length > 0) {
      setTimeout(() => {
        this.renderApplicant(
          data,
          this.docCustomerDetails?.length || data?.length,
        );
      });
    } else {
      if (this.docCustomerDetails?.length > 0) {
        for (let i = 0; i < this.docCustomerDetails?.length; i++)
          this.addCustomer(i);
      } else {
        this.addCustomer(0);
      }
    }
  }

  newCustomer(data?: any) {
    const formGroup = this.fb.group({
      userRefnumber: [data ? data?.userRefnumber : ''],
      icustRefNo: [data ? data?.icustRefNo : ''],
      customerId: data && data?.customerId,
      customerNo: [data ? data?.customerNo : ''],
      custStagingId: data?.custStagingId ?? null,
      corporateOnboardingStatus: [data ? data?.corporateOnboardingStatus : ''],
      autoVerificationType: [data ? data?.autoVerificationType : false],
      source: 'Website',
      kycStatus: data?.kycStatus && data?.kycStatus,
      documentId: this.fb.array([]),
      isSameAddress: [true],
      pepStatus: [data ? data?.pepStatus : ''],
      residentOfIndia: [data ? (data?.residentOfIndia ?? true) : true],
      kycInfo: this.fb.group({
        countryOfResidence: [data ? data?.kycInfo?.countryOfResidence : ''],
        prefixId: [data ? data?.kycInfo?.prefixId : ''],
        firstName: [data ? data?.kycInfo?.firstName : '', Validators.required],
        middleName: [data ? data?.kycInfo?.middleName : ''],
        lastName: [data ? data?.kycInfo?.lastName : ''],
        dateOfBirth: [
          data ? data?.kycInfo?.dateOfBirth : '',
          Validators.required,
        ],
        primaryCustomer: [data ? data?.primaryCustomer : false],
        maritalStatusId: [
          data ? data?.maritalStatusId : '',
          Validators.required,
        ],
        genderId: [data ? data?.genderId : ''],
        nationality: [data ? data?.nationality : ''],
        branchId: [data ? data?.branchId : ''],
        emergencyContact: this.fb.group({
          emergencyContactId: [
            data?.emergencyContact?.emergencyContactId ?? null,
          ],
          prefixId: [data?.emergencyContact?.prefixId ?? ''],
          prefixValue: [data?.emergencyContact?.prefixValue ?? ''],
          firstName: [
            data?.emergencyContact?.firstName ?? '',
            Validators.required,
          ],
          middleName: [data?.emergencyContact?.middleName ?? ''],
          lastName: [
            data?.emergencyContact?.lastName ?? '',
            Validators.required,
          ],
          relationshipId: [data?.emergencyContact?.relationshipId ?? ''],
          relationshipValue: [data?.emergencyContact?.relationshipValue ?? ''],

          contact: this.fb.group({
            contactId: [data?.emergencyContact?.contact?.contactId ?? null],
            telephone: [data?.emergencyContact?.contact?.telephone ?? ''],
            workTelephone: [
              data?.emergencyContact?.contact?.workTelephone ?? '',
            ],
            mobile: [data?.emergencyContact?.contact?.mobile ?? ''],
            email: [
              data?.emergencyContact?.contact?.email ?? '',
              Validators.pattern(
                '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$',
              ),
            ],
            fax: [data?.emergencyContact?.contact?.fax ?? ''],
            whatsappNo: [data?.emergencyContact?.contact?.whatsappNo ?? ''],
            alternativeNumber: [
              data?.emergencyContact?.contact?.alternativeNumber ?? '',
            ],
            residencePhone: [
              data?.emergencyContact?.contact?.residencePhone ?? '',
            ],
            mobtCode: [
              data?.emergencyContact?.contact?.mobtCode ??
                this.defaultIsdCodeValue,
            ],
            waptCode: [
              data?.emergencyContact?.contact?.waptCode ??
                this.defaultIsdCodeValue,
            ],
            altCode: [
              data?.emergencyContact?.contact?.altCode ??
                this.defaultIsdCodeValue,
            ],
            statementViaId: [
              data?.emergencyContact?.contact?.statementViaId ?? '',
            ],
            address: this.fb.array(
              data?.emergencyContact?.contact?.address?.map((addr: any) =>
                this.createEmergencyContactAddressGroup(addr),
              ) || [this.createEmergencyContactAddressGroup()],
            ),
          }),
        }),
      }),
      spouseInfo: this.fb.group({
        spouseDetilsId: [data?.spouseInfo?.spouseDetilsId ?? null],
        prefixId: [data?.spouseInfo?.prefixId ?? ''],
        prefixValue: [data?.spouseInfo?.prefixValue ?? ''],
        firstName: [data?.spouseInfo?.firstName ?? ''],
        middleName: [data?.spouseInfo?.middleName ?? ''],
        lastName: [data?.spouseInfo?.lastName ?? ''],
        dateOfBirth: [data?.spouseInfo?.dateOfBirth ?? ''],
        employeeStatusId: [data?.spouseInfo?.employeeStatusId ?? ''],
        employeeStatusValue: [data?.spouseInfo?.employeeStatusValue ?? ''],
        netIncome: [data?.spouseInfo?.netIncome ?? ''],

        contact: this.fb.group({
          contactId: [data?.spouseInfo?.contact?.contactId ?? null],
          telephone: [data?.spouseInfo?.contact?.telephone ?? ''],
          workTelephone: [data?.spouseInfo?.contact?.workTelephone ?? ''],
          mobile: [data?.spouseInfo?.contact?.mobile ?? ''],
          email: [
            data?.spouseInfo?.contact?.email ?? '',
            Validators.pattern(
              '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$',
            ),
          ],
          mobtCode: [
            data?.spouseInfo?.contact?.mobtCode ?? this.defaultIsdCodeValue,
          ],
        }),
      }),
      contact: this.fb.group({
        telephone: [data?.contact ? data?.contact?.telephone : ''],
        mobile: [data?.contact ? data?.contact?.mobile : ''],
        isphoneNumVerified: [
          data?.contact ? data?.contact?.isphoneNumVerified : false,
        ],
        email: [
          data?.contact ? data?.contact.email : '',
          Validators.pattern(
            '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$',
          ),
        ],
        workTelephone: [data?.contact ? data?.contact?.workTelephone : ''],
        emailVerified: [data?.contact ? data?.contact?.emailVerified : false],
        mobtCode: [
          data ? parseInt(data?.contact?.mobtCode) : this.defaultIsdCodeValue,
        ],
        alternativeNumber: [
          data?.contact ? data?.contact.alternativeNumber : '',
        ],
        altCode: [
          data ? parseInt(data?.contact?.altCode) : this.defaultIsdCodeValue,
        ],
        whatsappNo: [data?.contact ? data?.contact?.whatsappNo : ''],
        waptCode: [
          data ? parseInt(data?.contact?.waptCode) : this.defaultIsdCodeValue,
        ],
        fax: [data?.contact ? data?.contact?.fax : ''],
        statementViaId: [data?.contact ? data?.contact?.statementViaId : ''],
        address: this.fb.array([]),
      }),
      identificationDetails: {
        identificationNumber: [
          data ? data?.identificationDetails?.identificationNumber : '',
        ],
        passportNumber: [
          data ? data?.identificationDetails?.passportNumber : '',
        ],
        passportExpiryDate: [
          data ? data?.identificationDetails?.passportExpiryDate : '',
        ],
        kraPin: [data ? data?.identificationDetails?.kraPin : ''],
        tin: [data ? data?.identificationDetails?.tin : ''],
        countryOfIssue: [
          data ? data?.identificationDetails?.countryOfIssue : '',
        ],
        issueDate: [data ? data?.identificationDetails?.issueDate : ''],
      },
    });

    if (data?.documentInfoId?.length) {
      const docArray = formGroup.get('documentId') as FormArray;
      const docGroup = this.createDocumentGroup({
        docIds: data.documentInfoId,
      });
      docArray.push(docGroup);
    } else {
      const docArray = formGroup.get('documentId') as FormArray;
      docArray.push(this.createDocumentGroup(0));
    }
    return formGroup;
    console.log(this.customerDetailsForm, 'formgroup');
  }

  get customer(): FormArray {
    return this.customerDetailsForm.get('customer') as FormArray;
  }

  getDocumentIdArray(index: number): FormArray {
    return this.customer?.at(index)?.get('documentId') as FormArray;
  }

  getSpouseInfo(index: number): FormGroup {
    return this.customer.at(index).get('spouseInfo') as FormGroup;
  }

  getSpouseContactDetails(index: number): FormGroup {
    return this.getSpouseInfo(index).get('contact') as FormGroup;
  }

  getEmergencyContact(index: number): FormGroup {
    return this.customer.at(index).get('emergencyContact') as FormGroup;
  }

  getEmergencyContactDetails(index: number): FormGroup {
    return this.getEmergencyContact(index).get('contact') as FormGroup;
  }

  getEmergencyContactAddress(index: number): FormArray {
    return this.getEmergencyContactDetails(index).get('address') as FormArray;
  }

  getCustomerContactDetails(index: number): FormGroup {
    return this.customer.at(index)?.get('contact') as FormGroup;
  }

  //  This method is to add the default customer while patching if it have multiple customer
  renderApplicant(data: any, applicantLength: any) {
    for (let i = 0; i < applicantLength; i++)
      this.addCustomer(i, data && data[i]);
  }

  async addCustomer(i: number, data?: any) {
    const customerGroup = this.newCustomer(data);
    this.customer.push(customerGroup);
    this.addAddress(i, data?.contact?.address?.[0] ?? {});

    const maritalControl = customerGroup.get('maritalStatusId');
    const maritalId = maritalControl?.value;

    const isMarried =
      this.maritalStatusArray
        .find((item) => item.id === maritalId)
        ?.values?.toLowerCase() === 'married';

    const hasSpouseInfo =
      !!data?.spouseInfo?.firstName || !!data?.spouseInfo?.prefixId;

    this.showSpouseSection[i] = isMarried || hasSpouseInfo;

    maritalControl?.valueChanges.subscribe((newId: number) => {
      const status = this.maritalStatusArray
        .find((item) => item.id === newId)
        ?.values?.toLowerCase();
      this.showSpouseSection[i] = status === 'married';
    });
    this.cdr.detectChanges();
  }

  addAddress(i: any, address?: any) {
    const jk = this.customer.at(i).get('contact') as FormGroup;
    const pk = jk.get('address') as FormArray;
    const addressArrayControl = pk;
    addressArrayControl.push(
      this.fb.group({
        livingAddressSince: [
          address?.livingAddressSince ?? '',
          Validators.required,
        ],
        address1: [address?.address1 ?? '', [Validators.required]],
        address2: [address?.address2 ?? '', [Validators.required]],
        residenceTypeId: [
          address?.residenceTypeId ?? '',
          [Validators.required],
        ],
        addressTypeId: [address?.addressTypeId ?? ''],
        countryName: [address?.countryName ?? ''],
        pincode: [address?.pincode ?? '', [Validators.required]],
        stateName: [address?.stateName ?? ''],
        cityId: [address?.cityId ?? ''],
        cityName: [address?.cityName ?? ''],
      }),
    );
  }

  // Document Form Group
  createDocumentGroup(doc: any): FormGroup {
    return this.fb.group({
      docIds: [doc?.docIds || []],
      documentNumber: [doc?.documentNumber ?? '', Validators.required],
      issueDate: [doc?.issueDate ?? '', Validators.required],
      expiryDate: [doc?.expiryDate ?? '', Validators.required],
      countryOfIssue: [doc?.countryOfIssue ?? '', Validators.required],
    });
  }

  // EmergencyContactAddressGroup
  private createEmergencyContactAddressGroup(address?: any): FormGroup {
    const group = this.fb.group({
      addressId: [address?.addressId ?? null],
      address1: [address?.address1 ?? '', Validators.required],
      address2: [address?.address2 ?? '', Validators.required],
      cityName: [address?.cityName ?? '', Validators.required],
      stateName: [address?.stateName ?? ''],
      countryName: [address?.countryName ?? ''],
      pincode: [address?.pincode ?? '', Validators.required],
      cityId: [address?.cityId ?? ''],
      residenceTypeId: [address?.residenceTypeId ?? '', Validators.required],
      residenceTypeValue: [address?.residenceTypeValue ?? ''],
    });
    // This ensures validators are processed immediately
    group.updateValueAndValidity();
    return group;
  }

  getExpDateMin() {
    const currentDate = new Date(this.todayDate);
    currentDate.setDate(currentDate.getDate() + 1);
    return currentDate;
  }

  // Pincode Search Popup
  pincodeExpansion(
    customerIndex: number,
    addressType: 'customer' | 'emergency' = 'customer',
  ) {
    const dialogRef = this.dialog.open(ReusablePincodePopupComponent, {
      width: '60%',
      disableClose: true,
      panelClass: 'dialog-class',
    });

    dialogRef.afterClosed().subscribe((res: any) => {
      if (res) {
        if (addressType === 'customer') {
          // Handle customer address
          const customerAddress = this.customer
            .at(customerIndex)
            .get('contact.address') as FormArray;
          const addressControl = customerAddress.controls[0];
          addressControl?.patchValue(res);
          addressControl?.get('countryName')?.patchValue(res.countryName);
        } else {
          // Handle emergency contact address

          const emergencyAddress =
            this.getEmergencyContactAddress(customerIndex);

          if (emergencyAddress.controls[0]) {
            emergencyAddress.controls[0].patchValue(res);
            emergencyAddress.controls[0]
              .get('countryName')
              ?.patchValue(res.countryName);
          } else {
            // If no address exists, add one
            this.addEmergencyContactAddress(customerIndex, res);
          }
        }
        this.cdr.detectChanges();
      }
    });
  }

  addEmergencyContactAddress(index: number, address?: any): void {
    const addressArray = this.getEmergencyContactAddress(index);
    addressArray.push(this.createEmergencyContactAddressGroup(address));
  }

  // Save method
  handleSubmit() {
    const customerData = this.customer.controls.map(
      (customerGroup: any, index: any) => {
        const customer = customerGroup.value;

        const maritalStatus = this.maritalStatusArray
          .find(
            (item: GenericValueData) => item.id === customer.maritalStatusId,
          )
          ?.values?.toLowerCase();

        const isMarried = maritalStatus === 'married';

        const formattedCustomer = {
          ...customer,
          dateOfBirth: pluckOnlyDate(customer.dateOfBirth),
          primaryCustomer: index === 0,
          spouseInfo: isMarried
            ? {
                ...customer.spouseInfo,
                dateOfBirth: pluckOnlyDate(customer.spouseInfo?.dateOfBirth),
              }
            : undefined,
        };

        if (!isMarried) {
          delete formattedCustomer.spouseInfo;
        }

        return formattedCustomer;
      },
    );

    const payload = {
      originationId: this.originationId,
      screenCode: 460,
      customerInfo: customerData,
    };

    console.log(payload, 'payload');

    return this.accountService.saveAccountDetails(payload).pipe(
      tap((res) => {
        const customerInfo = res?.data?.customerInfo;
        if (
          customerInfo &&
          customerInfo.length > 0 &&
          customerInfo[0]?.custStagingId
        ) {
          this.sessionStorageService.setCustomerStagingId(
            customerInfo[0]?.custStagingId,
          );
        }
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

  // createAccordian(): void {
  //   const { accountType } = this.detailsForGeneric;
  //   // Reset accordion items
  //   this.accordionItems = [];
  //   // Titles for corporate applicants
  //   const corporateTitles = [
  //     'Managing Director',
  //     'Vice President',
  //     'CEO',
  //     'CFO',
  //     'CTO',
  //   ];
  //   // Add Minor Details section if account type is 'minor'
  //   if (accountType === 'minor') {
  //     this.accordionItems.push({
  //       header: 'Minor Details',
  //       expanded: true,
  //       showIsPrimary: false,
  //       accountType,
  //     });
  //   }
  //   // Generate header label based on account type and index
  //   const getHeaderLabel = (index: number): string => {
  //     if (accountType === 'corporate') {
  //       return corporateTitles[index] || `Corporate Member ${index + 1}`;
  //     }
  //     const labels: any = {
  //       joint: 'Applicant',
  //       minor: 'Guardians',
  //     };
  //     return `${labels[accountType] || 'Applicant'} ${index + 1}`;
  //   };
  //   // Create accordion items
  //   for (let i = 0; i < this.noOfapplicantguardian; i++) {
  //     this.accordionItems.push({
  //       header: getHeaderLabel(i),
  //       expanded: false,
  //       showIsPrimary: true,
  //       accountType,
  //     });
  //   }
  // }

  // deleteAccordian(index: any) {
  //   if (this.accordionItems.length > 1) {
  //     if (index > -1) {
  //       this.accordionItems.splice(index, 1);
  //     }
  //   }
  // }

  // getForm(form: any) {
  //   this.personalDetailsForm = form;
  // }
}
