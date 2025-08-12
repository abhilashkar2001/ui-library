import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-debit-card-details',
  templateUrl: './debit-card-details.component.html',
  styleUrls: ['./debit-card-details.component.scss'],
})
export class DebitCardDetailsComponent {
  debitCardForm!: FormGroup;
  address = [
    { label: 'My Address', value: true },
    { label: 'Branch Near Me', value: false },
  ];
  extractedFields = [
    { label: 'card Type', value: 'Aadhar Card' },
    {
      label: 'Daily Limit',

      value: '75000',
    },
    {
      label: 'Domestic Limit',

      value: '34000',
    },
    { label: 'International Limit', value: '10000' },
    { label: 'Atm Limit', value: '10' },
    {
      label: 'POS Limit',

      value: '50000',
    },
    {
      label: 'Internet Limit',

      value: '50000',
    },
  ];

  constructor(private fb: FormBuilder) {
    this.buildForm();
  }

  ngOnInIt() {}

  buildForm() {
    this.debitCardForm = this.fb.group({
      cardType: [''],
      cardName: [''],
      location: [''],
      branchName: [''],
      bankCode: [''],
    });
  }
}
