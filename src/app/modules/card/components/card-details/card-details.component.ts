import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-card-details',
  templateUrl: './card-details.component.html',
  styleUrls: ['./card-details.component.scss'],
})
export class CardDetailsComponent {
  cardForm!: FormGroup;
  address = [
    { label: 'My Address', value: true },
    { label: 'Branch Near Me', value: false },
  ];
  extractedFields = [
    { label: 'Card Type', value: 'Aadhar Card' },
    {
      label: 'Daily Limit',
      value: '75000',
    },
    {
      label: 'Domestic Limit',
      value: '34000',
    },
    { label: 'International Limit', value: '10000' },
    { label: 'ATM Limit', value: '10' },
    {
      label: 'POS Limit',
      value: '50000',
    },
    {
      label: 'Internet Limit',
      value: '50000',
    },
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInIt(): void {
    this.buildForm();
  }

  buildForm() {
    this.cardForm = this.fb.group({
      cardType: [''],
      cardName: [''],
      location: [''],
      branchName: [''],
      bankCode: [''],
      cardNetwork: [''],
      preferredBillingDate: [''],
      creditLimit: [''],
    });
  }
}
