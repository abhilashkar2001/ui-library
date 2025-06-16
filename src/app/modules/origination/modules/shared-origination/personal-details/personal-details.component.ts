import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { OpenAccountService } from 'app/shared/services/open-service/open-account.service';

@Component({
  selector: 'app-common-personal-details',
  templateUrl: './personal-details.component.html',
  styleUrls: ['./personal-details.component.scss'],
})
export class PersonalDetailsComponent implements OnInit {
  @Input() screen: string | any;
  @Output() OnConfirmEmitter: EventEmitter<any> = new EventEmitter();
  @Output() backEvent: EventEmitter<any> = new EventEmitter();
  personalDetailsForm: FormGroup | any;
  countries: any = [];
  stateList: any = [];
  cityList: any = [];
  accountHeader: string | any;
  flag: boolean | any;
  todayDate: Date = new Date();

  constructor(
    private fb: FormBuilder,
    private openAccountService: OpenAccountService,
  ) {}

  ngOnInit(): void {
    this.initialForm();
    this.getCountry();
  }

  getCountry() {
    this.openAccountService.getCountryList().subscribe((Countrylist: any) => {
      this.countries = Countrylist.data;
    });
  }

  onCountrySelect() {
    this.openAccountService
      .getState(this.personalDetailsForm.value.nationality)
      .subscribe((statelist: any) => {
        this.stateList = statelist.data;
      });
  }

  onSelectState() {
    this.openAccountService
      .getCity(this.personalDetailsForm.value.state)
      .subscribe((citylist: any) => {
        this.cityList = citylist.data;
      });
  }

  onSelectCity(cityObj: any) {
    this.personalDetailsForm.patchValue({
      zipCode: cityObj.pincode,
    });
  }

  initialForm() {
    this.personalDetailsForm = this.fb.group({
      cifNumber: new FormControl(''),
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      dateOfBirth: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      gender: new FormControl('', [Validators.required]),
      nationality: new FormControl('', [Validators.required]),
      city: new FormControl('', [Validators.required]),
      state: new FormControl('', [Validators.required]),
      address: new FormControl('', [Validators.required]),
      residentType: new FormControl('', [Validators.required]),
      country: new FormControl('', [Validators.required]),
      zipCode: new FormControl('', [Validators.required]),
    });
  }

  createPayLoad() {
    return {
      prefix:
        this.personalDetailsForm.value.gender.toLowerCase() === 'male'
          ? 'Mr.'
          : 'Mrs.',
      cifNumber: this.personalDetailsForm.value.cifNumber,
      firstName: this.personalDetailsForm.value.firstName,
      lastName: this.personalDetailsForm.value.firstName,
      middleName: '',
      gender: this.personalDetailsForm.value.gender,
      dateOfBirth: this.personalDetailsForm.value.dateOfBirth,
      nationality: this.personalDetailsForm.value.nationality,
      contact: {
        mobile: this.personalDetailsForm.value.mobile,
        email: this.personalDetailsForm.value.email,
        address: [
          {
            address1: this.personalDetailsForm.value.address,
            address2: '',
            residentType: this.personalDetailsForm.value.residentType,
            cityId: this.personalDetailsForm.value.city,
            country: this.personalDetailsForm.value.country,
            zipCode: this.personalDetailsForm.value.zipCode,
          },
        ],
      },
    };
  }

  onConfirm() {
    const payLoad = this.createPayLoad();
    this.OnConfirmEmitter.emit({ payLoad: payLoad });
  }

  onBack() {
    this.backEvent.emit();
  }
}
