import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { CardService } from "app/modules/net-banking/modules/card/card.service";
import { SessionStorageService } from "app/shared/services/session-storage.service";

@Component({
  selector: "app-qrcode",
  templateUrl: "./qrcode.component.html",
  styleUrls: ["./qrcode.component.scss"]
})
export class QrcodeComponent implements OnInit {
  accountList: any[] = [];
  customerInfo: any;
  imagesrc: any = "";
  baseImageblob: any;
  selectedAccountBank: any = "";
  qrform!: FormGroup;
  accountType: any;

  constructor(
    private matdialogref: MatDialogRef<QrcodeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private accService: CardService,
    private fb: FormBuilder,
    private sessionStorageService: SessionStorageService
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.customerInfo = this.sessionStorageService.getCustomerInfo();
    if (this.customerInfo?.accounts[0]?.accountList) {
      this.accountType = this.customerInfo?.accounts[0]?.accountType;
      this.customerInfo?.accounts[0]?.accountList?.map((res: any) => {
        this.accountList.push(res?.accountNo);
      });
      this.selectedAccountBank =
        this.customerInfo?.accounts[0].accountList[0].accountBranch;
      this.generateQr(this.customerInfo?.accounts[0].accountList[0].accountNo);
      this.qrform
        .get("accountValue")
        ?.patchValue(this.customerInfo?.accounts[0].accountList[0].accountNo);
    }
  }
  buildForm() {
    this.qrform = this.fb.group({
      accountValue: [""]
    });
  }

  cahngeAccount(accnum: any) {
    console.log(accnum);

    this.imagesrc = "";
    this.generateQr(accnum?.value);
  }
  generateQr(accnum: any) {
    this.accService.generateAccountQr(accnum).subscribe((res) => {
      this.baseImageblob = res;
      let reader = new FileReader();
      reader.readAsDataURL(res);
      reader.onload = (event: any) => {
        this.imagesrc = event?.target?.result;
      };
    });
  }

  download() {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(this.baseImageblob);
    a.download = "QrCode";
    document.body.appendChild(a);
    a.click();
    this.matdialogref.close();
  }
  share() {
    this.matdialogref.close();
  }

  closeDialogref() {
    this.matdialogref.close();
  }
}
