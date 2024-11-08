import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import {
  MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA,
  MatLegacyDialog as MatDialog,
  MatLegacyDialogRef as MatDialogRef,
} from "@angular/material/legacy-dialog";
// import { SignaturePad } from "angular2-signaturepad";
import { Subscription } from "rxjs";
import { HttpEventType, HttpResponse } from "@angular/common/http";
import SignaturePad from "signature_pad";
import { CommonService } from "app/shared/services/common-service/common.service";
import { SignPadComponent } from "app/modules/origination-external-callback/digital-sign/sign-pad/sign-pad.component";
import { SignNowPopupComponent } from "app/modules/origination-external-callback/digital-sign/sign-now-popup/sign-now-popup.component";
import { environment } from "environments/environment";
import { BranchService } from "app/modules/origination-external-callback/digital-sign/sign-now-popup/branch.service";
import { SessionStorageService } from "app/shared/services/session-storage.service";
// import { SignPadComponent } from "app/shared/components/sign-pad/sign-pad.component";
// import { ApiService } from "app/shared/services/api.service";
@Component({
  selector: "app-digital-sign",
  templateUrl: "./digital-sign.component.html",
  styleUrls: ["./digital-sign.component.scss"],
})
export class DigitalSignComponent implements OnInit {
  @Output() onBackEvent: EventEmitter<any> = new EventEmitter();
  @Output() onCustomSubmit: EventEmitter<any> = new EventEmitter();
  @Input("updateParentModel") updateParentModel: (value: Partial<any>) => void;
  @Input("nationalIdDocumentList") nationalIdDocumentList: any[] = [];
  @Input("numberOfDirectors") numberOfDirectors: number;

  image: string = "";
  MICROSERVICE_URL = environment.microServiceURL;
  isLoading: boolean = false;
  loadingBtnText: string = "Saving...";
  signatureId: any;
  customerId: number;

  constructor(
    private dialog: MatDialog,
    private branchService: BranchService,
    private sessionStorageService: SessionStorageService
  ) {}

  ngOnInit(): void {
    this.customerId = this.sessionStorageService.getItem("customerStagingId");
    if (this.customerId) this.fetchSign();
  }

  openDigitalSignDialog(check: string) {
    const dialogRef = this.dialog.open(SignNowPopupComponent, {
      disableClose: false,
      width: "60%",
      data: { title: "Sign Now", check: check },
    });
    dialogRef.afterClosed().subscribe((res) => {
      console.log(res);
      this.image = res?.result?.fileUrl;
      this.signatureId = res?.result?.signatureId;
    });
  }

  deleteImage() {
    this.image = "";
  }

  onBack() {
    this.onBackEvent.emit();
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
      customerId: this.customerId,
      signatureIds: [this.signatureId],
    };
    this.branchService.saveCustomerSign(signPayload).subscribe((res) => {
      if ((res?.statusCode == 200 || res?.statusCode == 201) && res?.data)
        this.onCustomSubmit.emit();
    });
  }
}
