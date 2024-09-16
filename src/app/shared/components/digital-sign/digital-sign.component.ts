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
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from "@angular/material/dialog";
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
  originationId: number;

  constructor(
    private dialog: MatDialog,
    private branchService: BranchService,
    private sessionStorageService: SessionStorageService
  ) {}

  ngOnInit(): void {
    this.originationId = this.sessionStorageService.getOriginationId();
    if (this.originationId) this.fetchSign();
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
    this.branchService.fetchSignImage(this.originationId).subscribe((res) => {
      this.image = res?.data?.signatureInfo?.fileUrl;
      this.signatureId = res?.data?.signatureInfo?.signatureId;
    });
  }

  onSubmit() {
    const signPayload = {
      originationId: this.originationId,
      signatureId: this.signatureId,
    };
    this.branchService.saveDigitalSignDetails(signPayload).subscribe((res) => {
      if (res?.statusCode == 200 && res?.data) this.onCustomSubmit.emit();
    });
  }
}
