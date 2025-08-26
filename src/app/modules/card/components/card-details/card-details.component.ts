import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { debitFields, CreditFields } from './card-details.store';
import { tap, map, catchError, of } from 'rxjs';
import { CardSerivce } from '../../card.service';
import { SessionStorageService } from 'app/shared/services/session-storage.service';
import { CardServiceModel, SaveCardDetailsPayload } from '../../cardModel';

@Component({
  selector: 'app-card-details',
  templateUrl: './card-details.component.html',
  styleUrls: ['./card-details.component.scss'],
})
export class CardDetailsComponent implements OnInit {
  cardForm!: FormGroup;
  @Input() screenCode: number | undefined;
  address = [
    { label: 'My Address', value: true },
    { label: 'Branch Near Me', value: false },
  ];
  typeOfCard = 'Credit';
  debitFields = debitFields({});
  CreditFields = CreditFields({});
  originationId!: number;

  constructor(
    private fb: FormBuilder,
    private cardService: CardSerivce,
    private sessionStorageService: SessionStorageService,
  ) {}

  ngOnInit(): void {
    this.originationId = this.sessionStorageService.getOriginationId();
    this.buildForm();
  }

  buildForm() {
    this.cardForm = this.fb.group({
      cardName: [''],
      cardTypeId: [''],
      cardType: [''],
      cardNetworkId: [true],
      preferredBillingDateId: [''],
      preferredBillingDate: [''],
      deliveryLocation: [''],
      addressId: [''],
      branchName: [''],
      bankCode: [''],
      creditLimit: [''],
      // deliveryAddress: ['Communication Address'],
    });
  }

  submitForm() {
    return this.handleSubmit().toPromise();
  }

  handleSubmit() {
    const payload: SaveCardDetailsPayload = {
      id: this.originationId,
      screenCode: this.screenCode,
      cardService: this.cardForm.value as CardServiceModel,
    };

    return this.cardService.saveCardDetails(payload).pipe(
      tap((res) => {
        console.log(res);
      }),
      map((res: any) =>
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
}
