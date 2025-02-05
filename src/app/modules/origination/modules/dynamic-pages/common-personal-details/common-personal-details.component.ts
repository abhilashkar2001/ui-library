import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  QueryList,
  SimpleChanges,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatAccordion, MatExpansionPanel } from '@angular/material/expansion';
import { NewDepositService } from 'app/modules/origination/modules/new-deposit/new-deposit.service';
import { CreateRdService } from 'app/modules/origination/modules/new-deposit/new-deposit/rd-calculator/create-rd.service';
import { LoanService } from 'app/shared/services/loan/loan.service';
import { OpenAccountService } from 'app/shared/services/open-service/open-account.service';
import * as moment from 'moment';

import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ReusablePincodePopupComponent } from '../../../../../shared/components/reusable-pincode-popup/reusable-pincode-popup.component';
import { ErrorNotifierPopupComponent } from '../../../../../shared/components/error-notifier-popup/error-notifier-popup.component';
import { forkJoin, Subscription } from 'rxjs';
import { AppState, LocaleData, selectLocaleData } from '@onerumango/utils';
import { PersonalDetailsConstant } from './personal-details.constant';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Data } from '@angular/router';
import { FACTORYPOPULATE } from 'app/shared/models/factory-populate.models';
import { SessionStorageService } from 'app/shared/services/session-storage.service';
import { Store } from '@ngrx/store';
import { GenericValueService } from 'app/shared/services/generic-value.service';

@Component({
  selector: 'app-common-personal-details',
  templateUrl: './common-personal-details.component.html',
  styleUrls: ['./common-personal-details.component.scss'],
})
export class CommonPersonalDetailsComponent implements OnInit, OnChanges {
  customerDetailsForm!: FormGroup;
  @Output() CustomSubmit = new EventEmitter<Data>();
  @Output() backEvent = new EventEmitter<Data>();
  @Output() customFormGroup = new EventEmitter<Data>();
  @Input() isHideField = false;
  @Input() basisId: any;
  @Input() personalDetails: any;
  @Input() updateParentModel: ((value: Partial<any>) => void) | any;
  @Input() docCustomerDetails: any;
  selectedStep = 0;
  @ViewChild(MatAccordion) accordion!: MatAccordion;
  @ViewChildren(MatExpansionPanel) panels!: QueryList<MatExpansionPanel>;
  @Input() customerInfo: any;
  @Input() mobileVerifyInfo: any = {};

  holderType: any;
  loanCustomerId: any;
  countryArray: any;

  listCityState: any = [];
  staticData = PersonalDetailsConstant.GENERIC_SATIC_KEYS;
  genderArray: any[] = [{}];
  prefixArray: any[] = [{}];
  residenceTypeArray: any[] = [{}];
  maritalStatusArray: any[] = [{}];
  todayDate: Date = new Date();
  listCity: any = [];
  primaryCustIndex = 0;
  boundaries: any;
  countriesIsdCodes: any;
  defaultIsdCodeValue: any;
  maxMobileLength: any;
  nationalityArray: any[] = [];
  debounceTimeout: any;
  errorDob: any;
  genderPrefixMap = new Map([
    ['male', 'Mr'],
    ['female', 'Ms'],
    ['female', 'Mrs'],
  ]);
  subscriptions: Subscription[] = [];
  private localeData: LocaleData | undefined;
  constructor(
    private fb: FormBuilder,
    private api: NewDepositService,
    private loanApi: LoanService,
    private openApi: OpenAccountService,
    private cd: ChangeDetectorRef,
    private rdApi: CreateRdService,
    private snack: MatSnackBar,
    private dialog: MatDialog,
    private sessionStorageService: SessionStorageService,
    private store: Store<AppState>,
    private genericValueService: GenericValueService,
  ) {}

  panelOpened(index: number) {
    this.panels.forEach((panel, i) => {
      if (i !== index) {
        panel.close();
      }
    });
  }

  ngOnChanges(changes: SimpleChanges | any): void {
    this.getAllRequisite().then(() => {
      if (changes?.personalDetails?.currentValue) {
        this.buildCustomerDetailsForm(changes.personalDetails.currentValue);
      } else this.buildCustomerDetailsForm();
    });
  }

  ngOnInit(): void {
    const localeData$ = this.store.select(selectLocaleData).subscribe((res) => {
      if (res) {
        this.localeData = res;
      }
    });
    this.subscriptions.push(localeData$);
    this.getGenericDetails();
    this.fetchBoundaries();
    this.holderType =
      this.sessionStorageService.getLoanHolderType()?.toLowerCase() || 'Self';
    this.loanCustomerId = this.sessionStorageService.getOriginationId();
    this.getAllRequisite().then(() => {
      if (this.personalDetails?.length > 0) {
        this.getGenericDetails();
        this.buildCustomerDetailsForm(this.personalDetails);
      } else {
        this.buildCustomerDetailsForm();
        console.log(this.docCustomerDetails, 'this.docCustomerDetails');
        if (this.docCustomerDetails)
          setTimeout(() => {
            if (this.docCustomerDetails instanceof Array) {
              this.docCustomerDetails.forEach((item, index) => {
                const customerFormGroup = this.customerDetailsForm.get(
                  'customer',
                ) as FormGroup;
                const customerIndex: any = customerFormGroup.controls[index];
                customerIndex
                  .get('dateOfBirth')
                  ?.setValue(
                    moment(item?.dateOfBirth, 'DD/MM/YYYY').format(
                      'YYYY-MM-DDTHH:mm:ss.SSS[Z]',
                    ),
                  );

                const applicantNameArray = item?.applicantName
                  ? item?.applicantName?.split(' ')
                  : [];
                if (applicantNameArray && applicantNameArray?.length >= 3) {
                  const cstomerFormGroup = this.customerDetailsForm.get(
                    'customer',
                  ) as FormGroup;
                  const cstomerIndex: any = cstomerFormGroup.controls[index];
                  cstomerIndex
                    .get('firstName')
                    .setValue(applicantNameArray?.slice(0, 2)?.join(' '));

                  const customerFormGroup = this.customerDetailsForm.get(
                    'customer',
                  ) as FormGroup;
                  const customerIndex: any = customerFormGroup.controls[index];
                  customerIndex
                    .get('lastName')
                    .setValue(
                      applicantNameArray?.[applicantNameArray.length - 1],
                    );
                } else {
                  const customerFormGroup = this.customerDetailsForm.get(
                    'customer',
                  ) as FormGroup;
                  const customerIndex: any = customerFormGroup.controls[index];
                  customerIndex
                    .get('firstName')
                    .setValue(applicantNameArray?.[0]);

                  const customerFormGrp = this.customerDetailsForm.get(
                    'customer',
                  ) as FormGroup;
                  const customerIdx: any = customerFormGrp.controls[index];
                  customerIdx
                    .get('lastName')
                    .setValue(
                      applicantNameArray?.[applicantNameArray.length - 1],
                    );
                }
                const gender = this.genderArray.find(
                  (e) =>
                    e.values?.toLowerCase() === item?.gender?.toLowerCase(),
                )?.id;
                const customerFormGrp = this.customerDetailsForm.get(
                  'customer',
                ) as FormGroup;
                const customerIdx: any = customerFormGrp.controls[index];
                customerIdx.get('gender').setValue(gender);

                if (item?.gender?.toLowerCase()) {
                  const prefix = this.prefixArray.filter(
                    (val: any) =>
                      val?.values ==
                      this.genderPrefixMap.get(item?.gender?.toLowerCase()),
                  );
                  const customerFormGrp = this.customerDetailsForm.get(
                    'customer',
                  ) as FormGroup;
                  const customerIdx: any = customerFormGrp.controls[index];
                  customerIdx.get('prefix').setValue(prefix[0]?.id);
                }

                const customerControl = this.customer.at(index) as FormGroup;

                if (customerControl) {
                  const contactControl = customerControl.get(
                    'contact',
                  ) as FormGroup;

                  if (contactControl) {
                    const addressArray = contactControl.get(
                      'address',
                    ) as FormArray;

                    if (addressArray && addressArray.controls?.[0]) {
                      const address = addressArray.controls[0] as FormGroup;

                      const backData =
                        this.sessionStorageService.getBackData() || [];
                      console.log(backData);
                      const addressData = backData?.[index];
                      console.log(address, addressData);
                      if (address && addressData) {
                        address
                          .get('pincode')
                          ?.patchValue(addressData.pincode || '');
                        address
                          .get('address1')
                          ?.patchValue(addressData.address1 || '');
                      }
                    }
                  }
                }
              });
              return;
            }
            const customerFormGroup = this.customerDetailsForm.get(
              'customer',
            ) as FormGroup;
            const customerIndex: any = customerFormGroup.controls[0];
            customerIndex
              .get('dateOfBirth')
              .setValue(
                moment(
                  this.docCustomerDetails?.dateOfBirth,
                  'DD/MM/YYYY',
                ).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
              );

            const applicantNameArray = this.docCustomerDetails?.applicantName
              ? this.docCustomerDetails?.applicantName?.split(' ')
              : [];
            if (applicantNameArray && applicantNameArray?.length >= 3) {
              const customerFormGroup = this.customerDetailsForm.get(
                'customer',
              ) as FormGroup;
              const customerIndex: any = customerFormGroup.controls[0];
              customerIndex
                .get('firstName')
                .setValue(applicantNameArray?.slice(0, 2)?.join(' '));

              const customerFormGrp = this.customerDetailsForm.get(
                'customer',
              ) as FormGroup;
              const customerIdx: any = customerFormGrp.controls[0];
              customerIdx
                .get('lastName')
                .setValue(applicantNameArray?.[applicantNameArray.length - 1]);
            } else {
              const customerFormGroup = this.customerDetailsForm.get(
                'customer',
              ) as FormGroup;
              const customerIndex: any = customerFormGroup.controls[0];
              customerIndex.get('firstName').setValue(applicantNameArray?.[0]);

              const customerFormGrp = this.customerDetailsForm.get(
                'customer',
              ) as FormGroup;
              const customerIdx: any = customerFormGrp.controls[0];
              customerIdx
                .get('lastName')
                .setValue(applicantNameArray?.[applicantNameArray.length - 1]);
            }
            const gender = this.genderArray.find(
              (e) =>
                e.values.toLowerCase() ===
                this.docCustomerDetails?.gender?.toLowerCase(),
            )?.id;

            const customerFormGrp = this.customerDetailsForm.get(
              'customer',
            ) as FormGroup;
            const customerIdx: any = customerFormGrp.controls[0];
            customerIdx.get('gender').setValue(gender);

            const customerControl = this.customer.at(0) as FormGroup;
            if (!customerControl) {
              throw new Error('Customer control is missing.');
            }

            const contactControl = customerControl.get('contact') as FormGroup;
            if (!contactControl) {
              throw new Error('Contact control is missing.');
            }

            const addressArray = contactControl.get('address') as FormArray;
            if (!addressArray || !addressArray.controls?.[0]) {
              throw new Error('Address array or controls are missing.');
            }

            const address = addressArray.controls[0] as FormGroup;
            const backData = this.sessionStorageService.getBackData() || [];
            if (!backData?.[0]) {
              throw new Error('Back data is missing.');
            }

            address.get('pincode')?.patchValue(backData[0].pincode || '');
            address.get('address1')?.patchValue(backData[0].address1 || '');
          }, 100);
      }
    });
  }

  async getAllRequisite() {
    return new Promise((resolve) => {
      forkJoin({
        countries: this.api.getCountryDetails(),
      }).subscribe(
        (res) => {
          console.log(res, '......');
          this.getCountry(res.countries);
          resolve('done');
        },
        () => {
          resolve('Fail');
        },
      );
    });
  }

  getState(resp: any) {
    if (resp?.statusCode === 200) {
      this.listCityState = resp.data;
    }
  }
  getCity(resp: any) {
    if (resp?.statusCode === 200) {
      this.countryArray = resp.data;
    }
    this.listCity = resp.data;
  }

  getCustomerById() {
    this.rdApi
      .getOriginationMaster(parseInt(this.loanCustomerId))
      .subscribe((resp) => {
        if (resp?.statusCode === 200) {
          const customerDetails = resp.data[0].customerInfo;
          this.buildCustomerDetailsForm(customerDetails);
        } else this.buildCustomerDetailsForm();
      });
  }

  getGenericDetails() {
    this.genericValueService
      .loadGenericValue(Object.keys(this.staticData))
      .subscribe((resp: any) => {
        if (resp?.statusCode === 200) {
          this.genderArray = resp.data['GENDER'];
          this.prefixArray = resp.data['PREFIX'];
          this.residenceTypeArray = resp.data['RESIDENCETYPE'];
          this.maritalStatusArray = resp.data['MARITALSTATUS'];
        }
      });
  }
  getCountry(resp: any) {
    if (resp?.statusCode === 200) {
      if (resp?.data) {
        this.countryArray = resp?.data;
        resp?.data.forEach((element: any) => {
          if (element.nationality != null) this.nationalityArray.push(element);
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

  buildCustomerDetailsForm(data?: any) {
    this.customerDetailsForm = this.fb.group({
      loanCustomerId: '',
      customer: this.fb.array([]),
    });

    if (data?.length > 0) {
      setTimeout(() => {
        this.renderApplicant(
          data,
          this.docCustomerDetails?.length || data?.length,
        );
      }, 200);
    } else {
      if (this.docCustomerDetails?.length > 0)
        for (let i = 0; i < this.docCustomerDetails?.length; i++)
          this.addCustomer(i);
      else this.addCustomer(0);
      this.cd.detectChanges();
    }
  }

  renderApplicant(data: any, applicantLength: any) {
    for (let i = 0; i < applicantLength; i++)
      this.addCustomer(i, data && data[i]);
  }

  get customer(): FormArray {
    return this.customerDetailsForm.get('customer') as FormArray;
  }

  newCustomer(data?: any): FormGroup {
    return this.fb.group({
      customerId: data && data.customerId,
      customerNo: [data ? data.customerNo : ''],
      customerStagingId: data?.customerStagingId ?? null,
      onboardingStatus: [data ? data.onboardingStatus : ''],
      primaryCustomer: [
        data ? data.primaryCustomer : this.customer.length == 0 ? true : false,
      ],
      prefix: [data ? data.prefix : '', Validators.required],
      firstName: [data ? data.firstName : '', Validators.required],
      lastName: [data ? data.lastName : '', Validators.required],
      dateOfBirth: [data ? data.dateOfBirth : '', Validators.required],

      gender: [data ? data.gender : '', Validators.required],
      nationality: [data ? data.nationality : '', Validators.required],
      maritalStatus: [data ? data.maritalStatus : '', Validators.required],
      source: data?.source ? data.source : 'Website',
      kycStatus: data?.kycStatus && data.kycStatus,
      documentId: this.calculateId(data),

      contact: this.fb.group({
        email: [
          data?.contact ? data?.contact.email : '',
          [
            Validators.required,
            Validators.pattern(
              '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$',
            ),
          ],
        ],
        mobile: [
          data?.contact ? data?.contact.mobile : '',
          [Validators.required],
        ],
        mobtCode: [
          data ? parseInt(data.contact.mobtCode) : this.defaultIsdCodeValue,
          [Validators.required],
        ],
        address: this.fb.array([]),
      }),
    });
  }

  addAddress(i: any, address?: any) {
    const jk = this.customer.at(i).get('contact') as FormGroup;
    const pk = jk.get('address') as FormArray;
    const addressArrayControl = pk;
    addressArrayControl.push(
      this.fb.group({
        address1: [address?.address1 ?? '', [Validators.required]],
        address2: [address?.address2 ?? ''],
        residenceType: [address?.residenceType ?? '', [Validators.required]],
        countryName: [address?.countryName ?? '', [Validators.required]],
        pincode: [address?.pincode ?? '', [Validators.required]],
        stateName: [address?.stateName ?? ''],
        cityId: [address?.cityId ?? ''],
        cityName: [address?.cityName ?? ''],
      }),
    );
  }

  calculateId(data: any) {
    const docIds: any = [];
    data?.documnentsInfo?.documents.forEach((item: any) => {
      const docItemId: any = [];
      item.docs.forEach((docItem: any) => {
        docItemId.push(docItem.documentId);
      });
      const docId = {
        docIds: docItemId,
      };
      docIds.push(docId);
    });
    return docIds;
  }

  async addCustomer(i: any, data?: any) {
    await this.customer.push(this.newCustomer(data));
    this.addAddress(i, data ? data.contact?.address[0] : {});
    this.debounceZipCodeAndCif();
  }
  debounceZipCodeAndCif() {
    for (let i = 0; i < this.customer.value?.length; i++) {
      this.fetchStateCity(i);
      this.getCustomerByCif(i);
      this.checkMobileValidtiy(i);
    }
  }

  fetchStateCity(i: any) {
    const customer = this.customer.at(i).get('contact') as FormGroup;
    const address: any = customer.get('address');

    const addressControl = address.controls[0];
    addressControl
      ?.get('pincode')
      .valueChanges.pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((value: any) => {
        if (value) {
          if (value.toString().length) {
            setTimeout(() => {
              this.loanApi
                .fetchStateCityByZipcode(value)
                .subscribe((res: any) => {
                  if (res?.statusCode === 200) {
                    addressControl.patchValue(res?.data?.[0]);
                    addressControl
                      .get('countryName')
                      ?.patchValue(res?.data?.[0]?.countryName);
                    addressControl
                      .get('cityName')
                      ?.patchValue(res?.data?.[0]?.city);
                    addressControl
                      .get('stateName')
                      ?.patchValue(res?.data?.[0]?.state);
                  }
                });
            }, 1000);
          }
        }
      });
  }

  get addressArray(): FormArray {
    return this.customer?.get('contact')?.get('address') as FormArray;
  }

  getCustomerByCif(i: any) {
    this.customer.controls[i]
      ?.get('customerNo')
      ?.valueChanges.pipe(debounceTime(500))
      .subscribe((value) => {
        if (value) {
          this.loanApi.getCustomerByCif(value).subscribe((resp) => {
            if (
              resp &&
              resp.statusCode === 200 &&
              Array.isArray(resp.data) &&
              resp.data[0] !== undefined
            ) {
              const payload = <FACTORYPOPULATE>resp?.data[0];
              this.customer.controls[i]?.patchValue(
                this.FactoryPopulate(payload),
              );
              this.customerDetailsForm.markAllAsTouched();
            } else {
              this.resetExceptCif(i);
            }
          });
        } else {
          this.resetExceptCif(i);
        }
      });
  }

  debounceValue(delay: number, value: number, i: any): void {
    if (this.debounceTimeout) {
      clearTimeout(this.debounceTimeout);
    }
    this.debounceTimeout = setTimeout(() => {
      const mobileControl = this.customer.at(i).get('contact')?.get('mobile');
      if (i == 0)
        this.openApi
          .checkMobileAndProduct(
            this.mobileVerifyInfo.basisName,
            value,
            this.mobileVerifyInfo.productDuplicationKey,
          )
          .subscribe((result) => {
            if (!result) {
              this.allreadyProduct(mobileControl);
            }
          });
    }, delay);
  }

  checkProductDuplicacy(event: any, i: any) {
    this.debounceValue(500, event.target.value, i);
  }

  checkMobileValidtiy(i: any) {
    const mobileControl: any = this.customer
      .at(i)
      .get('contact')
      ?.get('mobile');
    const mobileNo = parseInt(this.sessionStorageService.getMobileNo());
    if (mobileNo) {
      if (i === 0) {
        mobileControl.markAllAsTouched();
        mobileControl.patchValue(mobileNo);
      }
    }
    mobileControl.valueChanges
      .pipe(debounceTime(500))
      .subscribe((resp: any) => {
        if (String(resp)?.length != this.maxMobileLength && i != 0) {
          mobileControl.setErrors({
            ...mobileControl.errors,
            invalidLength: true,
          });
        }
      });
  }

  allreadyProduct(mobileControl: any) {
    const dialogRef = this.dialog.open(ErrorNotifierPopupComponent, {
      data: {
        errorMessage: `We have found similar ${this.mobileVerifyInfo.applicationType} in our record on your Mobile Number`,
        errorMessageHint: 'Please visit bank for more information.',
      },
      width: '650px',
      disableClose: true,
      panelClass: 'popup-dialog-class',
      backdropClass: 'bdrop',
    });
    dialogRef.afterClosed().subscribe(() => {
      mobileControl.setValue('');
    });
  }

  resetExceptCif(i: any) {
    const customerFormGroup = this.customerDetailsForm.get(
      'customer',
    ) as FormGroup;
    const customerIndex: any = customerFormGroup.controls[i];
    customerIndex.patchValue({
      primaryCustomer: false,
      prefix: '',
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      email: '',
      gender: '',
      nationality: '',
      address1: '',
      residenceType: '',
      countryName: '',
      pincode: '',
      state: '',
      cityId: '',
      source: '',
      kycStatus: '',
    });
  }
  pincodeExpansion() {
    const dialogRef = this.dialog.open(ReusablePincodePopupComponent, {
      width: '60%',
      disableClose: true,
      panelClass: 'dialog-class',
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        const customerFormGroup = this.customerDetailsForm.get(
          'customer',
        ) as FormGroup;
        const customerAddress: any = customerFormGroup.controls[
          'address'
        ] as FormGroup;
        customerAddress.controls[0];
        const addressControl = customerAddress.controls[0];

        addressControl.patchValue(res);
        addressControl.get('countryName')?.patchValue(res.countryName);
      }
    });
  }

  confirmCustomer() {
    if (
      this.customerDetailsForm.invalid ||
      (!this.isHideField && this.isAnyPrimaryCustomer())
    ) {
      return;
    }

    let prefixValue = null;
    this.customerDetailsForm.value.customer.forEach((element: any) => {
      this.prefixArray.forEach((el) => {
        if (element.primaryCustomer && el.id == element.prefix) {
          prefixValue = el.values;
        }
      });
    });
    console.log(this.customerDetailsForm, 'customerDetailsForm');
    this.CustomSubmit.emit({
      status: true,
      prefixValue: prefixValue,
      personalDetails: this.customerDetailsForm,
    });

    this?.updateParentModel({
      personalDetails: this.customerDetailsForm.value,
      updateMasterSave: true,
      prefixValue: prefixValue,
      isForLoan: false,
    });
  }

  /**
   * checking any one customer should be primary customer .If not then it will show message and return.
   * @returns is any customer primary or not.
   */
  isAnyPrimaryCustomer() {
    if (
      this.customerDetailsForm.value.customer.some(
        (item: any) => item?.primaryCustomer == true,
      )
    ) {
      return false;
    } else {
      this.dialog.open(ErrorNotifierPopupComponent, {
        data: {
          errorMessage: 'Please select primary customer',
        },
        width: '650px',
        disableClose: true,
        panelClass: 'popup-dialog-class',
        backdropClass: 'bdrop',
      });
      return true;
    }
  }

  goBack() {
    this.backEvent.emit();
  }
  saveCustomer(i: any) {
    this.closePanel(i);
    console.log(this.customerDetailsForm);
  }
  closePanel(index: any) {
    this.panels.forEach((panel, i) => {
      if (i == index) {
        panel.close();
      }
    });
  }

  FactoryPopulate(resp: FACTORYPOPULATE) {
    return {
      customerId: resp?.['customerId'],
      primaryCustomer: '',
      prefix: resp?.['prefix'],
      firstName: resp?.['firstName'],
      lastName: resp?.['lastName'],
      dateOfBirth: resp?.['dateOfBirth'],
      email: resp?.['contact']?.email,
      gender: resp?.['gender'],
      nationality: resp?.['nationality'],
      contact: {
        mobile: resp?.['contact']?.mobile,
        mobtCode: parseInt(resp?.['contact']?.mobtCode),
        email: resp?.['contact']?.email,
        address: [
          {
            address1: resp?.['contact']?.address?.[0]?.address1,
            residenceType: resp?.['contact']?.address?.[0]?.residenceType,
            countryName: resp?.['contact']?.address?.[0]?.countryName,
            pincode: resp?.['contact']?.address?.[0]?.pincode,
            state: resp?.['contact']?.address?.[0]?.stateName,
            cityId: resp?.['contact']?.address?.[0]?.cityId,
          },
        ],
      },
      source: resp?.['source'],
      kycStatus: resp?.['kycStatus'],
      mobile: resp?.['contact']?.mobile,
      data: null,
      mobtCode: parseInt(resp?.['contact']?.mobtCode),
    };
  }
  checkPrimaryCustomer() {
    return this.customerDetailsForm.value.customer.some((item: any, i: any) => {
      if (item.primaryCustomer) {
        this.primaryCustIndex = i;
        return item.primaryCustomer;
      } else return false;
    });
  }
  fetchBoundaries() {
    this.openApi.fetchBoundariesDetails(this.basisId).subscribe((res) => {
      if (res?.statusCode === 200 && res?.data) {
        this.boundaries = res.data[0];
      }
    });
  }

  dateOfBirthSelected(selectedDate: any, i: any) {
    const dateOfBirth = moment(selectedDate).format('YYYY-MMM-DD');
    console.log(this.calculateAge(dateOfBirth) > this.boundaries.minimumAge);
    if (this.calculateAge(dateOfBirth) < this.boundaries.minimumAge) {
      this.showAgeValidation(i);
      this.errorDob = `Min age should be ${this.boundaries?.minimumAge}`;
    } else if (this.calculateAge(dateOfBirth) > this.boundaries.maximumAge) {
      this.showAgeValidation(i);
      this.errorDob = `Max age should be ${this.boundaries?.maximumAge}`;
    }
  }
  showAgeValidation(i: any) {
    setTimeout(() => {
      const customerFormGroup = this.customerDetailsForm.get(
        'customer',
      ) as FormGroup;
      const customerIndex: any = customerFormGroup.controls[i];
      customerIndex.get('dateOfBirth').setValue(null);

      const customerFormGrp = this.customerDetailsForm.get(
        'customer',
      ) as FormGroup;
      const customerIdx: any = customerFormGrp.controls[i];
      customerIdx.get('dateOfBirth').setErrors({ invalidDob: true });
    }, 100);
  }
  calculateAge(dateOfBirth: any) {
    return moment().diff(dateOfBirth, 'years');
  }

  CheckGenderandPrefix(index: number) {
    const personalInfoGroup = this.customer.at(index);
    const prefix = this.prefixArray.filter(
      (item) => item.id === personalInfoGroup.get('prefix')?.value,
    )[0]?.values;
    const gender = this.genderArray.filter(
      (item) => item.id === personalInfoGroup.get('gender')?.value,
    )[0]?.values;
    if (prefix && gender) {
      if (
        (prefix.toLowerCase() === 'mr' && gender.toLowerCase() === 'male') ||
        ((prefix.toLowerCase() === 'ms' || prefix.toLowerCase() === 'mrs') &&
          gender.toLowerCase() === 'female')
      ) {
        console.log('Prefix and Gender match!');
      } else {
        personalInfoGroup.get('prefix')?.patchValue('');
        personalInfoGroup.get('gender')?.patchValue('');
        this.snack.open('Prefix and Gender does not match!', 'OK', {
          duration: 2000,
          verticalPosition: 'top',
          horizontalPosition: 'right',
        });
      }
    }
  }

  ngOnDestory(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
