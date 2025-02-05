import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatAccordion, MatExpansionPanel } from '@angular/material/expansion';
import * as moment from 'moment';
import { NewDepositService } from '../../../new-deposit.service';
import { PersonalDetailsService } from './personal-details.service';
import { debounceTime } from 'rxjs/operators';
import { SessionStorageService } from 'app/shared/services/session-storage.service';

@Component({
  selector: 'app-personal-details',
  templateUrl: './personal-details.component.html',
  styleUrls: ['./personal-details.component.scss'],
})
export class PersonalDetailsComponent implements OnInit {
  @Input() existingCustomer: any;
  @Output() customSavePersonal = new EventEmitter<{}>();
  @Output() personalBack = new EventEmitter<{}>();
  @Output() customFormGroup = new EventEmitter<{}>();

  isDone = true;
  selectedStep = 0;
  @ViewChild(MatAccordion) accordion!: MatAccordion;
  @ViewChildren(MatExpansionPanel) panels!: QueryList<MatExpansionPanel>;

  firstFormGroup = this.fb.group({});
  secondFormGroup = this.fb.group({
    secondCtrl: [''],
  });
  isLinear = true;
  holderType: any;
  fixedDepositId: any;
  countryArray: any;

  customerDetailsForm!: FormGroup;
  listCityState: any = [];

  constructor(
    private fb: FormBuilder,
    private api: NewDepositService,
    private personalDetailsService: PersonalDetailsService,
    private sessionStorageService: SessionStorageService,
  ) {}

  panelOpened(index: number) {
    this.panels.forEach((panel, i) => {
      if (i !== index) {
        panel.close();
      }
    });
  }

  ngAfterViewInit() {
    // Set up initial expansion state
    this.panels.forEach(() => {
      // panel.expandedChange.subscribe((expanded) => {
      //   this.items[i].expanded = expanded;
      // });
    });
  }

  ngOnInit(): void {
    if (this.existingCustomer) {
      this.buildCustomerDetailsForm(this.existingCustomer);
    } else {
      this.buildCustomerDetailsForm();
    }
    this.holderType = this.sessionStorageService.getHolderType() || 'Self';
    this.fixedDepositId = this.sessionStorageService.getFixedDepositId();
    this.getCountry();
  }
  getCountry() {
    this.api.getCountryDetails().subscribe((resp) => {
      if (resp?.statusCode == 200) {
        this.countryArray = resp.data;
      }
    });
  }

  buildCustomerDetailsForm(data?: any) {
    this.customerDetailsForm = this.fb.group({
      fixedDepositId: '',
      customer: this.fb.array([]),
    });
    setTimeout(() => {
      if (this.holderType == 'Self') this.addCustomer(data);
      else if (this.holderType == 'Joint') {
        for (let i = 0; i <= 1; i++) {
          if (i == 0) {
            this.addCustomer(data);
          } else {
            this.addCustomer();
          }
        }
      }
      this.customFormGroup.emit(this.customerDetailsForm);
    }, 200);
  }

  get customer(): FormArray {
    return this.customerDetailsForm.get('customer') as FormArray;
  }

  newCustomer(data?: any): FormGroup {
    return this.fb.group({
      customerId: [data ? data.customerId : ''],
      customerNo: [data ? data.customerNo : ''],
      primaryCustomer: [data ? data.primaryCustomer : ''],
      prefix: [data ? data.prefix : '', Validators.required],
      firstName: [data ? data.firstName : '', Validators.required],
      lastName: [data ? data.lastName : '', Validators.required],
      dateOfBirth: [data ? data.dateOfBirth : '', Validators.required],
      email: [data ? data.email : '', [Validators.required, Validators.email]],
      gender: [data ? data.gender : '', Validators.required],
      nationality: [data ? data.nationality : '', Validators.required],
      address1: [data ? data.address1 : ''],
      residenceType: [data ? data.residenceType : '', Validators.required],
      countryName: [data ? data.countryName : '', Validators.required],
      pincode: [data ? data.pincode : '', Validators.required],
      stateName: [data ? data.stateName : '', Validators.required],
      cityId: [data ? data.cityId : '', Validators.required],
    });
  }

  addCustomer(data?: any) {
    this.customer.push(this.newCustomer(data));
  }

  confirmCustomer() {
    if (this.customerDetailsForm.invalid) {
      return;
    }
    const customer = this.createPayload();
    console.log(this.customerDetailsForm.value);
    this.customSavePersonal.emit({
      status: true,
      personalDetails: customer,
    });
  }
  createPayload() {
    let contact = {};
    const customer: any = [];
    this.customerDetailsForm.value.customer.forEach((element: any) => {
      const address = {
        address1: element.address1,
        address2: '',
        residenceType: element.residenceType,
        countryName: element.countryName,
        stateName: element.stateName,
        cityId: element.cityId,
        // parseInt(element.cityId),
      };
      contact = {
        email: element.email,
        address: [address],
      };
      const customerDetails = {
        prefix: element.prefix,
        firstName: element.firstName,
        middleName: '',
        customerNo: element.customerNo,
        lastName: element.lastName,
        gender: element.gender,
        dateOfBirth: moment(element.dateOfBirth).format('YYYY-MM-DD'),
        nationality: element.nationality,
        contact: contact,
      };
      customer.push(customerDetails);
    });

    const payload = {
      fixedDepositId: this.fixedDepositId,
      customer: customer,
    };

    return payload;
  }

  goBack() {
    this.personalBack.emit();
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

  getCityandStateByZipcode(indx: any) {
    (<FormGroup>this.customer.controls[indx])
      .get('pincode')
      ?.valueChanges.pipe(debounceTime(500))
      .subscribe((value) => {
        if (value) {
          if (value.toString().length) {
            this.personalDetailsService
              .fetchStateCityByZipcode(value)
              .subscribe((res: any) => {
                if (res) {
                  this.listCityState = res?.data;
                  this.customer.controls[indx]
                    ?.get('stateName')
                    ?.patchValue(res?.data?.[0]?.state);
                  this.customer.controls[indx]
                    ?.get('cityId')
                    ?.patchValue(res?.data?.[0]?.cityId);
                }
              });
          }
        }
      });
  }
}
