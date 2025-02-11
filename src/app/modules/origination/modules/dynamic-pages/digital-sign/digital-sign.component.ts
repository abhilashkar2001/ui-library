import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SignNowPopupComponent } from 'app/modules/origination/modules/origination-external-callback/digital-sign/sign-now-popup/sign-now-popup.component';
import { environment } from 'environments/environment';
import { BranchService } from 'app/modules/origination/modules/origination-external-callback/digital-sign/sign-now-popup/branch.service';
import { SessionStorageService } from 'app/shared/services/session-storage.service';
import { MatDialog } from '@angular/material/dialog';
import { IcScreen } from '@onerumango/utils';

@Component({
  selector: 'app-digital-sign',
  templateUrl: './digital-sign.component.html',
  styleUrls: ['./digital-sign.component.scss'],
})
export class DigitalSignComponent implements OnInit {
  @Output() backEvent: EventEmitter<any> = new EventEmitter();
  @Output() CustomSubmit: EventEmitter<any> = new EventEmitter();
  @Input() updateParentModel: ((value: Partial<any>) => void) | any;
  @Input() nationalIdDocumentList: any[] = [];
  @Input() numberOfDirectors: number | any;
  @Input() screenInfo: IcScreen | undefined;

  image = '';
  MICROSERVICE_URL = environment.microServiceURL;
  isLoading = false;
  loadingBtnText = 'Saving...';
  signatureId: any;
  customerId: number | undefined;

  constructor(
    private dialog: MatDialog,
    private branchService: BranchService,
    private sessionStorageService: SessionStorageService,
  ) {}

  ngOnInit(): void {
    this.customerId = this.sessionStorageService.getCustomerStagingId();
    if (this.customerId) this.fetchSign();
  }

  openDigitalSignDialog(check: string) {
    const dialogRef = this.dialog.open(SignNowPopupComponent, {
      disableClose: false,
      width: '60%',
      data: { title: 'Sign Now', check: check },
    });
    dialogRef.afterClosed().subscribe((res) => {
      console.log(res);
      this.image = res?.result?.fileUrl;
      this.signatureId = res?.result?.signatureId;
    });
  }

  deleteImage() {
    this.image = '';
  }

  onBack() {
    this.backEvent.emit();
  }

  fetchSign() {
    this.branchService.fetchCustomerSign(this.customerId).subscribe((res) => {
      if (
        (res?.statusCode == 200 || res?.statusCode == 201) &&
        res?.data?.length
      ) {
        this.image = res?.data[0]?.fileUrl;
        this.signatureId = res?.data[0]?.signatureId;
      }
    });
  }

  onSubmit() {
    const signPayload = {
      customerStagingId: this.customerId,
      signatureId: [this.signatureId],
    };
    this.branchService.saveCustomerSign(signPayload).subscribe((res) => {
      if ((res?.statusCode == 200 || res?.statusCode == 201) && res?.data)
        this.CustomSubmit.emit();
    });
  }
}
