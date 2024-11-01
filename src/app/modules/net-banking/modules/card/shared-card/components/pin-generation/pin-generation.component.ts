import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { SessionStorageService } from "app/shared/services/session-storage.service";
import { OtpService } from "app/shared/services/otp.service";
import { PopupSuccessComponent } from "app/shared/components/popup-success/popup-success.component";
import { CardService } from "../../../card.service";
import { GeneratePinComponent } from "../generate-pin/generate-pin.component";
import { NavigationEnd, Router } from "@angular/router";
import { filter } from "rxjs/operators";

@Component({
  selector: "app-pin-generation",
  templateUrl: "./pin-generation.component.html",
  styleUrls: ["./pin-generation.component.scss"],
})
export class PinGenerationComponent implements OnInit {
  pinGenerationForm: FormGroup;
  listOfAccounts: any[] = [];
  customerId: any;
  accountDetails: any;
  otp: boolean = false;
  title: string;
  typeofCard: any;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private loginService: OtpService,
    private sessionStorageService: SessionStorageService,
    private apiService: CardService,
    private router: Router
  ) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.updateItemsBasedOnUrl(event.url);
      });
  }

  ngOnInit(): void {
    this.listOfAccounts = this.sessionStorageService.getListOfCards();
    this.buildPinGenerationForm();
    this.customerId = this.sessionStorageService.getCustomerInfo();
    // this.fetchListOfCards(this.customerId.customerId);
  }

  private buildPinGenerationForm(): void {
    this.pinGenerationForm = this.fb.group({
      selectCard: [""],
      cvv: [""],
      otp: [""],
    });
  }

  /**
   * update Items Based on url
   * @param url -url of the activated route
   */
  private updateItemsBasedOnUrl(url: string) {
    if (url.includes("/credit-card")) {
      this.title = "Credit Card";
    } else if (url.includes("/debit-card")) {
      this.title = "Debit Card";
    } else if (url.includes("/prepaid-card")) {
      this.title = "Prepaid Card";
    }
  }

  // private fetchListOfCards(customerId): void {
  //   this.apiService.fetchListOfCards(customerId).subscribe((resp) => {
  //     this.listOfAccounts = resp?.data || [];
  //   });
  // }

  getOtp(): void {
    this.otp = true;
    this.loginService.generateOTP(this.customerId.mobileNumber).subscribe();
  }

  proceed(): void {
    // Use the common dialog method
    this.openDialog(GeneratePinComponent, {
      width: "500px",
      disableClose: true,
      panelClass: "custom-dialog-class", // Pass form values
    }).subscribe((result) => {
      if (result) {
        this.setPin(result.pin);
      }
    });
  }

  patchDetails(event: any) {
    const account = event;
    this.accountDetails = this.listOfAccounts?.find(
      (card) => card?.cardNumber == account
    );
    if (this.accountDetails) {
      this.pinGenerationForm
        ?.get("selectCard")
        .patchValue(this.accountDetails?.cardNumber);
      this.pinGenerationForm?.get("cvv").patchValue(this.accountDetails?.cvv);
      this.typeofCard = this.accountDetails?.typeOfCard;
    }
  }

  private setPin(generatedPin: string): void {
    const { selectCard, cvv } = this.pinGenerationForm.value;
    this.apiService.setPin(selectCard, cvv, generatedPin).subscribe((resp) => {
      if (resp?.statusCode === 200) {
        this.openDialog(PopupSuccessComponent, {
          data: {
            auth: {
              type: "Success",
              status: "Created",
              msg: "Your New ATM PIN is set",
            },
          },
          disableClose: true,
          panelClass: "popup-dialog-class",
          backdropClass: "bdrop",
          width: "25%",
        }).subscribe((res) => {
          this.router.navigate(["/user/card/credit-card/dashboard"]);
        });
      }
    });
  }

  // Common method for opening dialogs
  private openDialog(component: any, config: any) {
    return this.dialog.open(component, config).afterClosed();
  }
}
