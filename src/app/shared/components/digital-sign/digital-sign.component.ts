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
import { SignNowPopupComponent } from "app/modules/origination-external-callback/digital-sign/sign-now-popup/sign-now-popup.component";
import { environment } from "environments/environment";
import { BranchService } from "app/modules/origination-external-callback/digital-sign/sign-now-popup/branch.service";
import { SessionStorageService } from "app/shared/services/session-storage.service";
import { MatDialog } from "@angular/material/dialog";

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
