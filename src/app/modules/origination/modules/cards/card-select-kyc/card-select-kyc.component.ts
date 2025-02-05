import { Component, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from 'app/shared/services/common-service/common.service';
import { OpenAccountService } from 'app/shared/services/open-service/open-account.service';

@Component({
  selector: 'app-card-select-kyc',
  templateUrl: './card-select-kyc.component.html',
  styleUrls: ['./card-select-kyc.component.scss'],
})
export class CardSelectKycComponent {
  @Output() backEvent: EventEmitter<any> = new EventEmitter();
  @Output() confirmEvent: EventEmitter<any> = new EventEmitter();
  showKyc = true;
  stepperTitle: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private apiService: OpenAccountService,
    private commonService: CommonService,
  ) {
    this.stepperTitle = this.activatedRoute.snapshot['queryParams']['title'];
    this.commonService.isUserUsingDifferentMobile(true);
  }

  onVerify() {
    this.confirmEvent.emit();
  }

  onSubmit(payload: any) {
    this.apiService.uploadMultipleDocument(payload).subscribe((resp: any) => {
      console.log(resp);
      this.confirmEvent.emit();
    });
  }

  onBack() {
    this.backEvent.emit();
  }
}
