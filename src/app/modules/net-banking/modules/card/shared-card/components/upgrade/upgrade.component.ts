import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { SessionStorageService } from 'app/shared/services/session-storage.service';
import { CardService } from '../../../card.service';
import { ServiceCallHandler } from 'app/shared/service-call.handler';
import { SelectNewCardPopupComponent } from '../select-new-card-popup/select-new-card-popup.component';
import { filter } from 'rxjs/operators';
import { TokenStorageService } from 'app/shared/token-storage.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-upgrade',
  templateUrl: './upgrade.component.html',
  styleUrls: ['./upgrade.component.scss'],
})
export class UpgradeComponent implements OnInit {
  upgradeForm!: FormGroup;
  cardList: any = [];
  upgradeCardDetails = false;
  selectedCard: any;
  profileInfo: any;
  communicationAddress: string | any;
  permanentAddress: string | any;
  accountDetails: any;
  typeofCard: any;
  selectedAddress: any;
  title: string | any;

  constructor(
    private fb: FormBuilder,
    private sessionStorageService: SessionStorageService,
    private dialog: MatDialog,
    private creditCardService: CardService,
    private serviceCallHandler: ServiceCallHandler,
    private router: Router,
    private tokenService: TokenStorageService,
  ) {
    this.profileInfo = this.tokenService.getUser();
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd), // Regular filter
      )
      .subscribe((event) => {
        const navEndEvent = event as NavigationEnd; // Type assertion
        this.updateItemsBasedOnUrl(navEndEvent.url);
      });
  }

  ngOnInit(): void {
    this.cardList = this.sessionStorageService.getListOfCards();
    // this.customerInfo = this.sessionStorageService.getCustomerInfo();
    this.buildUpgradeForm();
  }
  buildUpgradeForm() {
    this.upgradeForm = this.fb.group({
      cardNo: [''],
      addressType: ['Communication'],
      id: [''],
      cardType: [''],
      cardName: [''],
      joiningFees: [''],
      annualFees: [''],
      typeOfCard: [''],
    });
  }
  /**
   * update Items Based on url
   * @param url -url of the activated route
   */
  private updateItemsBasedOnUrl(url: string) {
    if (url.includes('/credit-card')) {
      this.title = 'Credit Card';
    } else if (url.includes('/debit-card')) {
      this.title = 'Debit Card';
    }
  }
  fetchDetails() {
    this.upgradeCardDetails = true;
    const dialogRef = this.dialog.open(SelectNewCardPopupComponent, {
      width: '60%',
      panelClass: 'custom-dialog-container',
    });
    dialogRef.afterClosed().subscribe((resp) => {
      if (resp?.upgradeCardDetails === true) {
        this.upgradeCardDetails = true;
        this.selectedCard = resp?.card;
        this.upgradeForm
          ?.get('cardType')
          ?.patchValue(this.selectedCard?.cardType);
        this.upgradeForm
          ?.get('cardName')
          ?.patchValue(this.selectedCard?.cardName);
        this.upgradeForm
          ?.get('joiningFees')
          ?.patchValue(this.selectedCard?.joiningFee);
        this.upgradeForm
          ?.get('annualFees')
          ?.patchValue(this.selectedCard?.annualFee);
        this.fetchAddressDetails();
      }
    });
  }

  patchDetails(event: any) {
    const account = event;
    this.accountDetails = this.cardList?.find(
      (card: any) => card?.cardNumber == account,
    );
    if (this.accountDetails) {
      this.upgradeForm?.get('id')?.patchValue(this.accountDetails?.id);
      this.typeofCard = this.accountDetails?.typeOfCard;
    }
  }

  fetchAddressDetails() {
    this.creditCardService
      .fetchbycustomerId(this.profileInfo?.corporateCustomerId)
      .subscribe((res) => {
        const addresses = res?.data?.[0]?.contact?.address;
        if (addresses && addresses.length === 1) {
          this.handleSingleAddress(addresses[0], 'Communication');
        } else if (addresses && addresses.length > 1) {
          this.handleMultipleAddresses(addresses);
        }
      });
  }

  handleSingleAddress(address: any, addressType: string) {
    this.upgradeForm?.get('addressType')?.patchValue(addressType);
    this.communicationAddress = this.formatAddress(address);
    this.onAddressSelectionChange(addressType);
  }

  handleMultipleAddresses(addresses: any[]) {
    addresses.forEach((element) => {
      if (element?.addressType === 'Communication') {
        this.upgradeForm?.get('addressType')?.patchValue('Communication');
        this.communicationAddress = this.formatAddress(element);
      } else if (element?.addressType === 'Permanent') {
        this.upgradeForm?.get('addressType')?.patchValue('Permanent');
        this.permanentAddress = this.formatAddress(element);
      }
    });
  }

  formatAddress(address: any): string {
    const {
      address1 = '',
      address2 = '',
      cityName = '',
      countryName = '',
      stateName = '',
      pincode = '',
    } = address;
    return `${address1}, ${address2}, ${cityName}, ${countryName}, ${stateName}, ${pincode}`;
  }

  onAddressSelectionChange(selectedAddressType: string) {
    const selectedAddressDetails =
      selectedAddressType === 'Communication'
        ? this.communicationAddress
        : this.permanentAddress;
    this.selectedAddress = this.splitAddress(selectedAddressDetails);
    console.log(this.selectedAddress);
  }

  splitAddress(address: string) {
    const cleanedAddress = address.replace(/\s*,\s*/g, ', ').trim();
    const addressParts = cleanedAddress.split(',').map((part) => part.trim());
    return addressParts;
  }

  proceed() {
    if (!this.upgradeForm?.valid) return;
    const payload = { ...this.upgradeForm.value };
    const paymentDetailsArr = [
      {
        eventType: 'mmidTransfer',
        operationType: 'upgrade_Card',
        status: 'confirm',
        masterId: 'retailFundTransferMasterId',
        statusHeader: 'Comfirm Payment',
        statusNews: 'Upgrade Card Successfully!',
        summary: [
          {
            header: 'Card Details',
            details: [
              {
                'File Upload': this.selectedCard?.fileUrl,
                'Card Name': this.selectedCard?.cardName,
                'Card Type': this.selectedCard?.cardType,
                'Joining Fee': this.selectedCard?.joiningFee,
                'Annual Fee': this.selectedCard?.annualFee,
              },
            ],
          },
          {
            header: 'Delivery Address',
            details: [
              { 'Address Line1': this.selectedAddress?.[0] },
              { 'Address Line2': this.selectedAddress?.[1] },
              { City: this.selectedAddress?.[3] },
              { State: this.selectedAddress?.[4] },
              { Country: this.selectedAddress?.[5] },
              { ZipCode: this.selectedAddress?.[6] },
            ],
          },
        ],
        qrToggle: false,
      },
    ];
    this.serviceCallHandler.put(
      'serviceHandler',
      payload,
      paymentDetailsArr,
      (payload) =>
        this.creditCardService.saveUpgradeCreditPaymentDetails(payload),
      // Service call completion callback
    );
    this.router.navigate(['/user/card/credit-card/service/payment-summary']);
  }
}
