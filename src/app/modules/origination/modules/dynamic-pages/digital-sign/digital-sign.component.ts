import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SignNowPopupComponent } from 'app/modules/origination/modules/origination-external-callback/digital-sign/sign-now-popup/sign-now-popup.component';
import { environment } from 'environments/environment';
import { BranchService } from 'app/modules/origination/modules/origination-external-callback/digital-sign/sign-now-popup/branch.service';
import { SessionStorageService } from 'app/shared/services/session-storage.service';
import { MatDialog } from '@angular/material/dialog';
import { IcScreen } from '@onerumango/utils';
import { DomSanitizer } from '@angular/platform-browser';

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
  filePreview: any;
  signatures: any[] = [];
  submitted = false;

  constructor(
    private dialog: MatDialog,
    private branchService: BranchService,
    private sessionStorageService: SessionStorageService,
    private sanitizer: DomSanitizer,
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
      if (res?.result?.uuid) {
        const newSignature = {
          fileUrl: res.result.fileUrl,
          signatureId: res.result.documentId,
          filePreview: this.sanitizer.bypassSecurityTrustResourceUrl(
            this.MICROSERVICE_URL + res.result.fileUrl,
          ),
        };
        this.signatures.push(newSignature);
      }
    });
  }

  deleteSignature(index: number) {
    this.signatures.splice(index, 1);
  }

  onBack() {
    this.backEvent.emit();
  }

  fetchSign() {
    this.branchService.fetchCustomerSign(this.customerId).subscribe((res) => {
      if (
        (res?.statusCode === 200 || res?.statusCode === 201) &&
        res?.data?.length
      ) {
        this.signatures = res.data.map((item: any) => ({
          signatureId: item.signatureId,
          fileUrl: item.fileUrl,
          filePreview: this.sanitizer.bypassSecurityTrustResourceUrl(
            this.MICROSERVICE_URL + item.fileUrl,
          ),
        }));
      }
    });
  }

  onSubmit() {
    if (!this.signatures.length) {
      this.submitted = true;
      return;
    }
    const signatureIds = this.signatures.map((sig) => sig.signatureId);
    const signPayload = {
      customerStagingId: this.customerId,
      signatureId: signatureIds,
    };
    this.branchService.saveCustomerSign(signPayload).subscribe((res) => {
      if ((res?.statusCode == 200 || res?.statusCode == 201) && res?.data)
        this.CustomSubmit.emit();
    });
  }
}
