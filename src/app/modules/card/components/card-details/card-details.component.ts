import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { debitFields, CreditFields } from './card-details.store';
import { tap, map, catchError, of } from 'rxjs';
import { CardSerivce } from '../../card.service';
import { SessionStorageService } from 'app/shared/services/session-storage.service';
import { CardServiceModel, SaveCardDetailsPayload } from '../../cardModel';
import { GenericValueService } from 'app/shared/services/generic-value.service';

@Component({
  selector: 'app-card-details',
  templateUrl: './card-details.component.html',
  styleUrls: ['./card-details.component.scss'],
})
export class CardDetailsComponent implements OnInit {
  cardForm!: FormGroup;
  @Input() screenCode: number | undefined;
  @Input() basisClass: string | undefined;
  address = [
    { label: 'My Address', value: true },
    { label: 'Branch Near Me', value: false },
  ];
  staticData = {
    CARDTYPE: [],
    CARDNETWORK: [],
    PREFERREDBILLINGDATE: [],
  };
  typeOfCard = 'Credit';
  debitFields = debitFields({});
  CreditFields = CreditFields({});
  cardId!: number | null;
  genericValue: any | undefined;

  constructor(
    private fb: FormBuilder,
    private cardService: CardSerivce,
    private sessionStorageService: SessionStorageService,
    private genericValueService: GenericValueService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.cardId = this.sessionStorageService.getOriginationId();
    this.fetchGenericValues();
    this.buildForm();
    if (this.cardId) {
      this.fetchCardDetails();
    }
  }

  fetchGenericValues() {
    this.genericValueService
      .loadGenericValue(Object.keys(this.staticData))
      .subscribe((resp: any) => {
        if (resp?.statusCode === 200) {
          this.genericValue = resp?.data;
        }
      });
  }

  fetchCardDetails() {
    if (this.cardId)
      this.cardService
        .fetchDynamicScreen(this.cardId, 'CardServicesInfo')
        .subscribe((res: any) => {
          if (res?.data) {
            this.cardId = res?.data?.cardId;
            if (res) {
              this.cardForm.patchValue(res.data?.cardService);
            }
          }
          this.cdr.detectChanges();
        });
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
      cardId: this.cardId,
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
