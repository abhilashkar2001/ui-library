import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { CommonService } from 'app/shared/services/common-service/common.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.scss'],
})
export class LoginComponent implements OnInit {
  countriesIsdCodes: any[] = [];
  countryTelIsdCode: any;
  defaultIsdCodeValue: any;
  maxMobileLength: any;
  subscriptions: Subscription[] = [];
  otpForm!: FormGroup;

  constructor(
    private commonService: CommonService,
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.loadCountries();
    this.buildForm();
  }

  buildForm() {
    this.otpForm = this.fb.group({
      phone: [''],
      isdCode: [''],
    });
  }
  // Get All Countrys and Isd code Mthd
  loadCountries() {
    this.commonService.getAllCountries().subscribe((resp: any) => {
      if (resp.data.length > 0) {
        this.countriesIsdCodes = resp?.data?.map(
          (country: any) => country.countryTelIsdCode,
        );
      } else {
        this.countriesIsdCodes = [];
      }
    });
  }
}
