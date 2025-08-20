import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { debitFields, CreditFields } from './card-details.store';

@Component({
  selector: 'app-card-details',
  templateUrl: './card-details.component.html',
  styleUrls: ['./card-details.component.scss'],
})
export class CardDetailsComponent implements OnInit {
  cardForm!: FormGroup;
  address = [
    { label: 'My Address', value: true },
    { label: 'Branch Near Me', value: false },
  ];
  typeOfCard = 'Credit';
  debitFields = debitFields({});
  CreditFields = CreditFields({});

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm() {
    this.cardForm = this.fb.group({
      cardType: [''],
      cardName: [''],
      location: [true],
      branchName: [''],
      bankCode: [''],
      cardNetwork: [''],
      preferredBillingDate: [''],
      creditLimit: [''],
      deliveryAddress: ['Communication Address'],
    });
  }
}
