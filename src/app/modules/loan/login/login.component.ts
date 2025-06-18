import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CountryService } from '../../../shared/services/country-service';

@Component({
  selector: 'app-login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.scss'],
})
export class LoginComponent implements OnInit {
  countriesIsdCodes: any[] = [];
  countryTelIsdCode: any;
  subscriptions: Subscription[] = [];
  otpForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private countryService: CountryService,
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

  loadCountries() {
    this.countryService.getCountries().subscribe((resp: any) => {
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
