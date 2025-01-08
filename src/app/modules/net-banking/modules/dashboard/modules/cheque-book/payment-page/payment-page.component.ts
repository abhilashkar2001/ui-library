import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { ServiceCallHandler } from 'app/shared/service-call.handler';
import { SessionStorageService } from 'app/shared/services/session-storage.service';
import { TokenStorageService } from 'app/shared/token-storage.service';

@Component({
  selector: 'app-payment-page',
  templateUrl: './payment-page.component.html',
  styleUrls: ['./payment-page.component.scss'],
})
export class PaymentPageComponent implements OnInit, OnDestroy {
  resp: any;
  paymentDetails: any;
  status: string | any;
  response: any;
  scheduleSummary = false;
  download: Blob | any;
  payeeFrom: any;
  customerInfo: any;
  profileInfo: any;
  constructor(
    private serviceCallHandler: ServiceCallHandler,
    private matIconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    private tokenStorageService: TokenStorageService,
    private sessionStorageService: SessionStorageService,
  ) {
    this.matIconRegistry.addSvgIcon(
      'download-icon',
      this.sanitizer.bypassSecurityTrustResourceUrl(
        'assets/images/svg/download-white.svg',
      ),
    );
    this.matIconRegistry.addSvgIcon(
      'share-icon',
      this.sanitizer.bypassSecurityTrustResourceUrl(
        'assets/images/svg/share.svg',
      ),
    );
  }

  ngOnInit(): void {
    this.customerInfo = this.sessionStorageService.getCustomerInfo();
    this.profileInfo = this.tokenStorageService.getUser();
    this.paymentDetails = this.serviceCallHandler.get('serviceHandler', true);
    if (this.paymentDetails[0]?.eventType == 'schedule-payment')
      this.scheduleSummary = true;
    else this.scheduleSummary = false;
  }

  async serviceCall(event: any) {
    if (event) {
      this.resp = await this.serviceCallHandler.get('serviceHandler', false);
      this.status = this.resp?.status;
      this.response = this.resp?.res?.data;
    }
  }

  ngOnDestroy(): void {
    this.serviceCallHandler.remove('serviceHandler');
  }
}
