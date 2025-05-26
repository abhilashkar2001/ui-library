import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  SimpleChanges,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatAccordion, MatExpansionPanel } from '@angular/material/expansion';
import { LoanService } from 'app/shared/services/loan/loan.service';
import { OpenAccountService } from 'app/shared/services/open-service/open-account.service';
// import * as moment from 'moment';
import { debounceTime, distinctUntilChanged, finalize } from 'rxjs/operators';
import { ReusablePincodePopupComponent } from '../../../../../shared/components/reusable-pincode-popup/reusable-pincode-popup.component';
import { forkJoin, Subscription } from 'rxjs';
import { AppState, LocaleData, selectLocaleData } from '@onerumango/utils';
import { PersonalDetailsConstant } from './personal-details.constant';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Data } from '@angular/router';
import { SessionStorageService } from 'app/shared/services/session-storage.service';
import { Store } from '@ngrx/store';
import { GenericValueService } from 'app/shared/services/generic-value.service';
import { DateTimeService } from 'app/shared/services/date-time/date-time.service';
import { pluckOnlyDate } from 'app/shared/helpers/utils';
import { CountryService } from 'app/shared/services/country-service';
@Component({
  selector: 'app-common-personal-details',
  templateUrl: './common-personal-details.component.html',
  styleUrls: ['./common-personal-details.component.scss'],
})
export class CommonPersonalDetailsComponent
  implements OnInit, OnChanges, OnDestroy
{
  customerDetailsForm!: FormGroup;
  @Output() CustomSubmit = new EventEmitter<Data>();
  @Output() backEvent = new EventEmitter<Data>();
  @Output() customFormGroup = new EventEmitter<Data>();
  @Input() isHideField = false;
  @Input() basisId: any;
  personalDetails: any;
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
  empoymentArray: any[] = [{}];
  relationArray: any[] = [{}];
  statementOptionArr: any[] = [{}];
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
  dateFormat!: string;
  screenCodeValue: number | undefined;
  isMarried = false;
  constructor(
    private fb: FormBuilder,
    private loanApi: LoanService,
    private openApi: OpenAccountService,
    private cdr: ChangeDetectorRef,
    private snack: MatSnackBar,
    private dialog: MatDialog,
    private sessionStorageService: SessionStorageService,
    private store: Store<AppState>,
    private genericValueService: GenericValueService,
    private dateService: DateTimeService,
    private personalData: LoanService,
    private countryService: CountryService,
  ) {}

  ngOnInit(): void {
    const localeData$ = this.store.select(selectLocaleData).subscribe((res) => {
      if (res) {
        this.localeData = res;
      }
    });
    this.dateFormat = this.dateService?.format.toLocaleLowerCase();
    this.subscriptions.push(localeData$);

    this.getGenericDetails();
    this.fetchBoundaries();

    this.holderType =
      this.sessionStorageService.getLoanHolderType()?.toLowerCase() || 'self';
    this.loanCustomerId = this.sessionStorageService.getOriginationId();
    this.screenCodeValue = this.sessionStorageService.getCurrentScreenCode();
    // this.loanCustomerId = 67583;
    this.getAllRequisite().then(() => {
      if (!this.personalDetails) {
        this.buildCustomerDetailsForm();
      }
    });
    const personalDetailsSub = this.personalData
      .getPersonalDetailsData(this.loanCustomerId)
      .pipe(
        finalize(() => {
          this.buildCustomerDetailsForm(this.personalDetails);
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

    this.subscriptions.push(personalDetailsSub);
  }

  ngOnChanges(changes: SimpleChanges | any): void {
    this.getAllRequisite().then(() => {
      if (changes?.personalDetails?.currentValue) {
        this.buildCustomerDetailsForm(changes.personalDetails.currentValue);
      } else this.buildCustomerDetailsForm();
    });
  }

  panelOpened(index: number) {
    this.panels.forEach((panel, i) => {
      if (i !== index) {
        panel.close();
      }
    });
  }

  async getAllRequisite() {
    return new Promise((resolve) => {
      forkJoin({
        countries: this.countryService.getCountries(),
      }).subscribe(
        (res) => {
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

  getGenericDetails() {
    this.genericValueService
      .loadGenericValue(Object.keys(this.staticData))
      .subscribe((resp: any) => {
        if (resp?.statusCode === 200) {
          this.genderArray = resp.data['GENDER'];
          this.prefixArray = resp.data['PREFIX'];
          this.residenceTypeArray = resp.data['RESIDENCETYPE'];
          this.maritalStatusArray = resp.data['MARITALSTATUS'];
          this.empoymentArray = resp.data['EMPLOYMENTTYPE'];
          this.relationArray = resp.data['RELATIONSHIPTYPE'];
          this.statementOptionArr = resp.data['COMMUNICATIONTYPE'];
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

  // To check the Mobilelength according to isdCode
  checkMobileLength(value: any, contactGroup: FormGroup, controlName: string) {
    if (!contactGroup) {
      return;
    }
    const countryCode = this.countriesIsdCodes?.find(
      (resp: any) => resp.countryTelIsdCode === Number(value),
    );
    if (countryCode) {
      this.maxMobileLength = countryCode?.mobileLength;
      const control = contactGroup.get(controlName);
      if (control) {
        const validators = [
          Validators.maxLength(this.maxMobileLength),
          Validators.minLength(this.maxMobileLength),
        ];
        if (controlName === 'mobile') {
          validators.unshift(Validators.required);
        }
        control.setValidators(validators);
        control.updateValueAndValidity();
      }
    }
  }

  buildCustomerDetailsForm(data?: any) {
    this.customerDetailsForm = this.fb.group({
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
      if (this.docCustomerDetails?.length > 0) {
        for (let i = 0; i < this.docCustomerDetails?.length; i++)
          this.addCustomer(i);
      } else {
        this.addCustomer(0);
      }
      if (this.docCustomerDetails?.length > 0)
        setTimeout(() => {
          if (this.docCustomerDetails instanceof Array) {
            this.docCustomerDetails.forEach((item, index) => {
              const customerFormGroup = this.customerDetailsForm.get(
                'customer',
              ) as FormGroup;
              const customerIndex: any = customerFormGroup.controls[index];
              customerIndex.get('dateOfBirth')?.setValue(item?.dateOfBirth);
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
              const genderId = this.genderArray.find(
                (e) =>
                  e.values?.toLowerCase() === item?.genderId?.toLowerCase(),
              )?.id;
              const customerFormGrp = this.customerDetailsForm.get(
                'customer',
              ) as FormGroup;
              const customerIdx: any = customerFormGrp.controls[index];
              customerIdx.get('genderId').setValue(genderId);

              if (item?.genderId?.toLowerCase()) {
                const prefixId = this.prefixArray.filter(
                  (val: any) =>
                    val?.values ==
                    this.genderPrefixMap.get(item?.genderId?.toLowerCase()),
                );
                const customerFormGrp = this.customerDetailsForm.get(
                  'customer',
                ) as FormGroup;
                const customerIdx: any = customerFormGrp.controls[index];
                customerIdx.get('prefixId').setValue(prefixId[0]?.id);
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
            .setValue(this.docCustomerDetails?.dateOfBirth);

          const applicantNameArray = this.docCustomerDetails?.applicantName
            ? this.docCustomerDetails?.applicantName?.split(' ')
            : [];
          console.log(this.docCustomerDetails);
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
          const genderId = this.genderArray.find(
            (e) =>
              e.values.toLowerCase() ===
              this.docCustomerDetails?.genderId?.toLowerCase(),
          )?.id;

          const customerFormGrp = this.customerDetailsForm.get(
            'customer',
          ) as FormGroup;
          const customerIdx: any = customerFormGrp.controls[0];
          customerIdx.get('genderId').setValue(genderId);

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
          this.debounceZipCodeAndCif();
        }, 100);
      this.cdr.detectChanges();
    }

    setTimeout(() => {
      const maritalStatusIdControl = this.customer
        .at(0)
        ?.get('maritalStatusId');
      maritalStatusIdControl?.valueChanges.subscribe((statusId: number) => {
        const status = this.maritalStatusArray
          .find((item) => item.id === statusId)
          ?.values?.toLowerCase();
        const isMarried = status === 'married';
        this.isMarried = isMarried;
        const spouse = this.getSpouseInfo(0);
        const contact = this.getSpouseContactDetails(0);
        const spouseFields = [
          'prefix',
          'firstName',
          'lastName',
          'dateOfBirth',
          'employeeStatusId',
          'netIncome',
        ];
        const contactFields = ['mobile', 'email'];
        spouseFields.forEach((field) =>
          spouse
            .get(field)
            ?.setValidators(isMarried ? Validators.required : null),
        );
        contactFields.forEach((field) => {
          const ctrl = contact.get(field);
          if (!ctrl) return;
          const validators = isMarried ? [Validators.required] : [];
          if (field === 'email')
            validators.push(
              Validators.pattern(
                '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$',
              ),
            );
          ctrl.setValidators(validators);
        });

        [
          ...spouseFields.map((f) => spouse.get(f)),
          ...contactFields.map((f) => contact.get(f)),
        ].forEach((ctrl) => ctrl?.updateValueAndValidity());
      });
    }, 2000);
  }

  renderApplicant(data: any, applicantLength: any) {
    for (let i = 0; i < applicantLength; i++)
      this.addCustomer(i, data && data[i]);
  }

  newCustomer(data?: any): FormGroup {
    const documentId =
      data.documentInfo?.map((doc: any) => doc?.documentId) ?? [];
    if (data?.maritalStatusId) {
      const status = this.maritalStatusArray
        .find((item) => item.id === data.maritalStatusId)
        ?.values?.toLowerCase();
      this.isMarried = status === 'married';
    }

    const docInfo = data?.documentInfo?.[0];
    const docGroup = this.createDocumentGroup({
      docIds: documentId ?? [],
      documentNumber: docInfo?.documentNumber ?? '',
      issueDate: docInfo?.issueDate ?? '',
      expiryDate: docInfo?.expiryDate ?? '',
      countryOfIssue: docInfo?.countryOfIssue ?? '',
    });

    const formGroup = this.fb.group({
      customerId: data && data?.customerId,
      customerNo: [data ? data?.customerNo : ''],
      custStagingId: data?.custStagingId ?? null,
      onboardingStatus: [data ? data?.onboardingStatus : ''],
      primaryCustomer: [data ? data?.primaryCustomer : false],
      prefixId: [data ? data?.prefixId : '', Validators.required],
      firstName: [data ? data?.firstName : '', Validators.required],
      lastName: [data ? data?.lastName : '', Validators.required],
      dateOfBirth: [data ? data?.dateOfBirth : '', Validators.required],
      genderId: [data ? data?.genderId : '', Validators.required],
      nationality: [data ? data?.nationality : '', Validators.required],
      maritalStatusId: [data ? data?.maritalStatusId : '', Validators.required],
      countryOfResidence: [
        data ? data?.countryOfResidence : '',
        Validators.required,
      ],
      source: data?.source ? data?.source : 'Website',
      kycStatus: data?.kycStatus && data?.kycStatus,
      documentId: this.fb.array([docGroup]),
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
          worktelephone: [data?.spouseInfo?.contact?.worktelephone ?? ''],
          mobile: [data?.spouseInfo?.contact?.mobile ?? ''],
          email: [data?.spouseInfo?.contact?.email ?? ''],

          mobtCode: [
            data?.spouseInfo?.contact?.mobtCode ?? this.defaultIsdCodeValue,
          ],
        }),
      }),
      emergencyContactInfo: this.fb.group({
        emergencyContactId: [
          data?.emergencyContactInfo?.emergencyContactId ?? null,
        ],
        prefixId: [
          data?.emergencyContactInfo?.prefixId ?? '',
          Validators.required,
        ],
        prefixValue: [data?.emergencyContactInfo?.prefixValue ?? ''],
        firstName: [
          data?.emergencyContactInfo?.firstName ?? '',
          Validators.required,
        ],
        middleName: [data?.emergencyContactInfo?.middleName ?? ''],
        lastName: [
          data?.emergencyContactInfo?.lastName ?? '',
          Validators.required,
        ],
        relationshipId: [
          data?.emergencyContactInfo?.relationshipId ?? '',
          Validators.required,
        ],
        relationshipValue: [
          data?.emergencyContactInfo?.relationshipValue ?? '',
        ],
        contact: this.fb.group({
          contactId: [data?.emergencyContactInfo?.contact?.contactId ?? null],
          telephone: [data?.emergencyContactInfo?.contact?.telephone ?? ''],
          worktelephone: [
            data?.emergencyContactInfo?.contact?.worktelephone ?? '',
          ],
          mobile: [
            data?.emergencyContactInfo?.contact?.mobile ?? '',
            Validators.required,
          ],
          email: [
            data?.emergencyContactInfo?.contact?.email ?? '',
            [
              Validators.required,
              Validators.pattern(
                '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$',
              ),
            ],
          ],
          fax: [data?.emergencyContactInfo?.contact?.fax ?? ''],
          whatsappNo: [data?.emergencyContactInfo?.contact?.whatsappNo ?? ''],
          alternativeNumber: [
            data?.emergencyContactInfo?.contact?.alternativeNumber ?? '',
          ],
          residencePhone: [
            data?.emergencyContactInfo?.contact?.residencePhone ?? '',
          ],
          mobtCode: [
            data?.emergencyContactInfo?.contact?.mobtCode ??
              this.defaultIsdCodeValue,
          ],
          waptCode: [
            data?.emergencyContactInfo?.contact?.waptCode ??
              this.defaultIsdCodeValue,
          ],
          altCode: [
            data?.emergencyContactInfo?.contact?.altCode ??
              this.defaultIsdCodeValue,
          ],
          statementViaId: [
            data?.emergencyContactInfo?.contact?.statementViaId ?? '',
          ],
          address: this.fb.array(
            data?.emergencyContactInfo?.contact?.address?.map((addr: any) =>
              this.createEmergencyContactAddressGroup(addr),
            ) || [this.createEmergencyContactAddressGroup()],
          ),
        }),
      }),

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
          data?.contact ? data?.contact?.mobile : '',
          [Validators.required],
        ],
        mobtCode: [
          data ? parseInt(data?.contact?.mobtCode) : this.defaultIsdCodeValue,
          Validators.required,
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
        telephone: [
          data?.contact ? data?.contact?.telephone : '',
          Validators.required,
        ],
        worktelephone: [data?.contact ? data?.contact?.worktelephone : ''],
        fax: [data?.contact ? data?.contact?.fax : '', Validators.required],
        statementViaId: [
          data?.contact ? data?.contact?.statementViaId : '',
          Validators.required,
        ],
        address: this.fb.array([]),
      }),
    });
    return formGroup;
  }

  createDocumentGroup(doc: any): FormGroup {
    return this.fb.group({
      docIds: [doc?.docIds || []],
      documentNumber: [doc?.documentNumber ?? '', Validators.required],
      issueDate: [doc?.issueDate ?? '', Validators.required],
      expiryDate: [doc?.expiryDate ?? '', Validators.required],
      countryOfIssue: [doc?.countryOfIssue ?? '', Validators.required],
    });
  }

  getDocumentIdArray(index: number): FormArray {
    return this.customer?.at(index)?.get('documentId') as FormArray;
  }
  get customer(): FormArray {
    return this.customerDetailsForm.get('customer') as FormArray;
  }

  getCustomerContactDetails(index: number): FormGroup {
    return this.customer.at(index)?.get('contact') as FormGroup;
  }

  get addressArray(): FormArray {
    return this.customer?.get('contact')?.get('address') as FormArray;
  }

  getDocumentInfoArray(index: number): FormArray {
    return this.customer.at(index).get('documentInfo') as FormArray;
  }

  getDocumentControl(
    customerIndex: number,
    docIndex: number,
    controlName: string,
  ): AbstractControl | null {
    const docArray = this.getDocumentInfoArray(customerIndex);
    if (
      !docArray ||
      !docArray.controls ||
      docIndex >= docArray.controls.length
    ) {
      return null;
    }

    const documentGroup = docArray.controls[docIndex];
    return documentGroup?.get(controlName) || null;
  }

  getSpouseInfo(index: number): FormGroup {
    return this.customer.at(index).get('spouseInfo') as FormGroup;
  }

  getSpouseContactDetails(index: number): FormGroup {
    return this.getSpouseInfo(index).get('contact') as FormGroup;
  }

  getEmergencyContactInfo(index: number): FormGroup {
    return this.customer.at(index).get('emergencyContactInfo') as FormGroup;
  }

  getEmergencyContactDetails(index: number): FormGroup {
    return this.getEmergencyContactInfo(index).get('contact') as FormGroup;
  }

  getEmergencyContactAddress(index: number): FormArray {
    return this.getEmergencyContactDetails(index).get('address') as FormArray;
  }

  addEmergencyContactAddress(index: number, address?: any): void {
    const addressArray = this.getEmergencyContactAddress(index);
    addressArray.push(this.createEmergencyContactAddressGroup(address));
  }

  clearEmergencyContactAddress(index: number): void {
    const addressArray = this.getEmergencyContactAddress(index);
    while (addressArray.length) {
      addressArray.removeAt(0);
    }
  }

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
      residenceType: [address?.residenceType ?? '', Validators.required],
      residenceTypeValue: [address?.residenceTypeValue ?? ''],
    });

    // This ensures validators are processed immediately
    group.updateValueAndValidity();

    return group;
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
        residenceType: [address?.residenceType ?? '', [Validators.required]],
        countryName: [address?.countryName ?? ''],
        pincode: [address?.pincode ?? '', [Validators.required]],
        stateName: [address?.stateName ?? ''],
        cityId: [address?.cityId ?? ''],
        cityName: [address?.cityName ?? ''],
      }),
    );
  }

  async addCustomer(i: any, data?: any) {
    await this.customer.push(this.newCustomer(data));
    this.addAddress(i, data ? data.contact?.address[0] : {});
    this.debounceZipCodeAndCif();
  }

  debounceZipCodeAndCif() {
    for (let i = 0; i < this.customer.value?.length; i++) {
      this.fetchStateCity(i);
      // this.getCustomerByCif(i);
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
                  } else {
                    addressControl.get('countryName')?.setValue(null);
                    addressControl.get('cityName').setValue(null);
                    addressControl.get('stateName')?.setValue(null);
                  }
                });
            }, 1000);
          }
        }
      });
  }

  // getCustomerByCif(i: any) {
  //   this.customer.controls[i]
  //     ?.get('customerNo')
  //     ?.valueChanges.pipe(debounceTime(500))
  //     .subscribe((value) => {
  //       if (value) {
  //         this.loanApi.getCustomerByCif(value).subscribe((resp) => {
  //           if (
  //             resp &&
  //             resp.statusCode === 200 &&
  //             Array.isArray(resp.data) &&
  //             resp.data[0] !== undefined
  //           ) {
  //             const payload = <FACTORYPOPULATE>resp?.data[0];
  //             this.customer.controls[i]?.patchValue(
  //               this.FactoryPopulate(payload),
  //             );
  //             this.customerDetailsForm.markAllAsTouched();
  //           } else {
  //             this.resetExceptCif(i);
  //           }
  //         });
  //       } else {
  //         this.resetExceptCif(i);
  //       }
  //     });
  // }

  // debounceValue(delay: number, value: number, i: any): void {
  //   if (this.debounceTimeout) {
  //     clearTimeout(this.debounceTimeout);
  //   }
  //   this.debounceTimeout = setTimeout(() => {
  //     const mobileControl = this.customer.at(i).get('contact')?.get('mobile');
  //     if (i == 0)
  //       this.openApi
  //         .checkMobileAndProduct(
  //           this.mobileVerifyInfo.basisName,
  //           value,
  //           this.mobileVerifyInfo.productDuplicationKey,
  //         )
  //         .subscribe((result) => {
  //           if (!result) {
  //             this.allreadyProduct(mobileControl);
  //           }
  //         });
  //   }, delay);
  // }

  // checkProductDuplicacy(event: any, i: any) {
  //   this.debounceValue(500, event.target.value, i);
  // }

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

  // allreadyProduct(mobileControl: any) {
  //   const dialogRef = this.dialog.open(ErrorNotifierPopupComponent, {
  //     data: {
  //       errorMessage: `We have found similar ${this.mobileVerifyInfo.applicationType} in our record on your Mobile Number`,
  //       errorMessageHint: 'Please visit bank for more information.',
  //     },
  //     width: '650px',
  //     disableClose: true,
  //     panelClass: 'popup-dialog-class',
  //     backdropClass: 'bdrop',
  //   });
  //   dialogRef.afterClosed().subscribe(() => {
  //     mobileControl.setValue('');
  //   });
  // }

  // resetExceptCif(i: any) {
  //   const customerFormGroup = this.customerDetailsForm.get(
  //     'customer',
  //   ) as FormGroup;
  //   const customerIndex: any = customerFormGroup.controls[i];
  //   customerIndex.patchValue({
  //     primaryCustomer: false,
  //     prefixId: '',
  //     firstName: '',
  //     lastName: '',
  //     dateOfBirth: '',
  //     email: '',
  //     genderId: '',
  //     nationality: '',
  //     address1: '',
  //     residenceType: '',
  //     countryName: '',
  //     pincode: '',
  //     state: '',
  //     cityId: '',
  //     source: '',
  //     kycStatus: '',
  //   });
  // }

  pincodeExpansion(
    customerIndex: number,
    addressType: 'customer' | 'emergency' = 'customer',
  ) {
    const dialogRef = this.dialog.open(ReusablePincodePopupComponent, {
      width: '60%',
      disableClose: true,
      panelClass: 'dialog-class',
    });

    dialogRef.afterClosed().subscribe((res) => {
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
      }
    });
  }

  confirmCustomer() {
    if (
      this.customerDetailsForm.invalid
      // this.isAnyPrimaryCustomer())
    ) {
      this.customerDetailsForm.markAllAsTouched();
      return;
    }

    const customerData = this.customerDetailsForm.value.customer.map(
      (customer: any) => {
        return {
          ...customer,
          dateOfBirth: pluckOnlyDate(customer.dateOfBirth),
          spouseInfo: customer.spouseInfo
            ? {
                ...customer.spouseInfo,
                dateOfBirth: pluckOnlyDate(customer.spouseInfo.dateOfBirth),
              }
            : null,
        };
      },
    );
    const payload = {
      originationId: this.loanCustomerId,
      customerInfo: customerData,
      screenCode: this.sessionStorageService.getCurrentScreenCode(),
    };
    payload.customerInfo[0].primaryCustomer = true;

    if (!this.isMarried) {
      payload.customerInfo.forEach((spouse: any) => {
        delete spouse.spouseInfo;
      });
    }

    this.loanApi.savePersonalDetails(payload).subscribe((resp) => {
      if (resp.statusCode === 200) {
        this.sessionStorageService.setCustomerStagingId(
          resp?.data?.customerInfo?.[0]?.custStagingId,
        );
        this.sessionStorageService.setCustomerData(
          JSON.stringify({
            name: (
              (resp?.data?.customerInfo?.[0]?.firstName || '') +
              ' ' +
              (resp?.data?.customerInfo?.[0]?.lastName || '')
            ).trim(),
            mobile: (
              (resp?.data?.customerInfo?.[0]?.contact?.mobtCode || '') +
              (resp?.data?.customerInfo?.[0]?.contact?.mobtCode ? '-' : '') +
              (resp?.data?.customerInfo?.[0]?.contact?.mobile || '')
            ).trim(),
          }),
        );
        this.CustomSubmit.emit({ isNext: true });
      }
    });
    // this?.updateParentModel({
    //   personalDetails: this.customerDetailsForm.value,
    //   updateMasterSave: true,
    //   prefixValue: prefixValue,
    //   isForLoan: false,
    // });
  }

  // onConfirm() {
  //   const payload = {
  //     ...this.loanDetailsForm?.value,
  //   };
  //   payload.originationModel.originationId = this.originationId;
  //   this.loanApi.savePersonalDetails(payload).subscribe((resp) => {
  //     if (resp.statusCode === 200) {
  //       this.CustomSubmit.emit({ isNext: true });
  //     }
  //   });
  // }

  confirmCustomertoCheck() {
    console.log(this.customerDetailsForm);
  }
  /**
   * checking any one customer should be primary customer .If not then it will show message and return.
   * @returns is any customer primary or not.
   */
  // isAnyPrimaryCustomer() {
  //   if (
  //     this.customerDetailsForm.value.customer.some(
  //       (item: any) => item?.primaryCustomer == true,
  //     )
  //   ) {
  //     return false;
  //   } else {
  //     this.dialog.open(ErrorNotifierPopupComponent, {
  //       data: {
  //         errorMessage: 'Please select primary customer',
  //       },
  //       width: '650px',
  //       disableClose: true,
  //       panelClass: 'popup-dialog-class',
  //       backdropClass: 'bdrop',
  //     });
  //     return true;
  //   }
  // }

  goBack() {
    this.backEvent.emit();
  }
  saveCustomer(i: any) {
    this.closePanel(i);
  }
  closePanel(index: any) {
    this.panels.forEach((panel, i) => {
      if (i == index) {
        panel.close();
      }
    });
  }

  // FactoryPopulate(resp: FACTORYPOPULATE) {
  //   return {
  //     customerId: resp?.['customerId'],
  //     primaryCustomer: '',
  //     prefixId: resp?.['prefixId'],
  //     firstName: resp?.['firstName'],
  //     lastName: resp?.['lastName'],
  //     dateOfBirth: resp?.['dateOfBirth'],
  //     email: resp?.['contact']?.email,
  //     genderId: resp?.['genderId'],
  //     nationality: resp?.['nationality'],
  //     contact: {
  //       mobile: resp?.['contact']?.mobile,
  //       mobtCode: parseInt(resp?.['contact']?.mobtCode),
  //       email: resp?.['contact']?.email,
  //       address: [
  //         {
  //           address1: resp?.['contact']?.address?.[0]?.address1,
  //           residenceType: resp?.['contact']?.address?.[0]?.residenceType,
  //           countryName: resp?.['contact']?.address?.[0]?.countryName,
  //           pincode: resp?.['contact']?.address?.[0]?.pincode,
  //           state: resp?.['contact']?.address?.[0]?.stateName,
  //           cityId: resp?.['contact']?.address?.[0]?.cityId,
  //         },
  //       ],
  //     },
  //     source: resp?.['source'],
  //     kycStatus: resp?.['kycStatus'],
  //     mobile: resp?.['contact']?.mobile,
  //     data: null,
  //     mobtCode: parseInt(resp?.['contact']?.mobtCode),
  //   };
  // }

  // checkPrimaryCustomer() {
  //   return this.customerDetailsForm.value.customer.some((item: any, i: any) => {
  //     if (item.primaryCustomer) {
  //       this.primaryCustIndex = i;
  //       return item.primaryCustomer;
  //     } else return false;
  //   });
  // }

  fetchBoundaries() {
    this.openApi.fetchBoundariesDetails(this.basisId).subscribe((res) => {
      if (res?.statusCode === 200 && res?.data) {
        this.boundaries = res.data[0];
      }
    });
  }

  // dateOfBirthSelected(selectedDate: any, i: any) {
  //   const dateOfBirth = moment(selectedDate).format('MM-DD-YYYY');
  //   console.log(this.calculateAge(dateOfBirth) > this.boundaries.minimumAge);
  //   if (this.calculateAge(dateOfBirth) < this.boundaries.minimumAge) {
  //     this.showAgeValidation(i);
  //     this.errorDob = `Min age should be ${this.boundaries?.minimumAge}`;
  //   } else if (this.calculateAge(dateOfBirth) > this.boundaries.maximumAge) {
  //     this.showAgeValidation(i);
  //     this.errorDob = `Max age should be ${this.boundaries?.maximumAge}`;
  //   }
  // }

  // showAgeValidation(i: any) {
  //   setTimeout(() => {
  //     const customerFormGroup = this.customerDetailsForm.get(
  //       'customer',
  //     ) as FormGroup;
  //     const customerIndex: any = customerFormGroup.controls[i];
  //     customerIndex.get('dateOfBirth').setValue(null);

  //     const customerFormGrp = this.customerDetailsForm.get(
  //       'customer',
  //     ) as FormGroup;
  //     const customerIdx: any = customerFormGrp.controls[i];
  //     customerIdx.get('dateOfBirth').setErrors({ invalidDob: true });
  //   }, 100);
  // }

  // calculateAge(dateOfBirth: any) {
  //   return moment().diff(dateOfBirth, 'years');
  // }

  CheckGenderandPrefix(index: number) {
    const personalInfoGroup = this.customer.at(index);
    const prefixId = this.prefixArray.filter(
      (item) => item.id === personalInfoGroup.get('prefixId')?.value,
    )[0]?.values;
    const genderId = this.genderArray.filter(
      (item) => item.id === personalInfoGroup.get('genderId')?.value,
    )[0]?.values;
    if (prefixId && genderId) {
      if (
        (prefixId.toLowerCase() === 'mr' &&
          genderId.toLowerCase() === 'male') ||
        ((prefixId.toLowerCase() === 'ms' ||
          prefixId.toLowerCase() === 'mrs') &&
          genderId.toLowerCase() === 'female')
      ) {
        console.log('prefixId and genderId match!');
      } else {
        personalInfoGroup.get('prefixId')?.patchValue('');
        personalInfoGroup.get('genderId')?.patchValue('');
        this.snack.open('prefixId and genderId does not match!', 'OK', {
          duration: 2000,
          verticalPosition: 'top',
          horizontalPosition: 'right',
        });
      }
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
