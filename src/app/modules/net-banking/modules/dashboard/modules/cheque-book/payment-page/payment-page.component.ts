import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { ServiceCallHandler } from 'app/shared/service-call.handler';
import { User } from '@onerumango/utils';
import { selectUser } from '@onerumango/utils';
import { Observable, Subscription } from 'rxjs';
import { SessionStorageService } from 'app/shared/services/session-storage.service';

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
  profileInfo: User | undefined;
  userProfile$: Observable<User | null>;
  subscriptions: Subscription[] = [];
  constructor(
    private serviceCallHandler: ServiceCallHandler,
    private matIconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    private store: Store,
    private sessionStorageService: SessionStorageService,
  ) {
    this.userProfile$ = this.store.select(selectUser);
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
    this.loadUserProfile();
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

  loadUserProfile() {
    const loadUserProfileSub = this.userProfile$.subscribe((result) => {
      if (result) {
        this.profileInfo = result;
      }
    });
    this.subscriptions.push(loadUserProfileSub);
  }

  ngOnDestroy(): void {
    this.serviceCallHandler.remove('serviceHandler');
    this.subscriptions.forEach((subscribe) => subscribe.unsubscribe());
  }
}
