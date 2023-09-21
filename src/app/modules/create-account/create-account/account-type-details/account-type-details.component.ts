import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Location } from "@angular/common";
import { environment } from "environments/environment";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "app-account-type-details",
  templateUrl: "./account-type-details.component.html",
  styleUrls: ["./account-type-details.component.scss"],
})
export class AccountTypeDetailsComponent implements OnChanges, OnInit {
  @Input() subClassList;
  @Output() customApply = new EventEmitter<any>();
  basisClass: any = "";
  endPoints = environment.microServiceURL;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private snackBar: MatSnackBar
  ) {
    this.basisClass = this.route.snapshot.params["id"];
  }

  ngOnInit(): void {}
  ngOnChanges(changes: SimpleChanges): void {
    this.subClassList = changes?.subClassList?.currentValue;
  }

  apply(clasDetails) {
    if (clasDetails?.productDetails === null) {
      this.snackBar.open("No Products Available", "Ok", {
        duration: 3000,
        verticalPosition: "top",
        horizontalPosition: "right",
      });
    } else if (clasDetails?.productDetails?.length > 1) {
      this.customApply.emit({
        clasDetails: clasDetails,
        subClass: clasDetails?.subClass,
      });
    } else if (clasDetails?.productDetails?.length == 1) {
      const payload = JSON.stringify({
        accountType: clasDetails?.productDetails[0].basisName,
        basisDetailsId: clasDetails?.productDetails[0].basisId,
        processCycleCode: clasDetails?.productDetails[0].processCycleCode,
      });
      localStorage.setItem("basisDetails", payload);
      this.customApply.emit({
        clasDetails: clasDetails,
        subClass: clasDetails?.subClass,
      });
    } else {
      const payload = JSON.stringify({
        accountType: clasDetails.basisName,
        basisDetailsId: clasDetails.basisId,
        processCycleCode: clasDetails.processCycleCode,
      });
      localStorage.setItem("basisDetails", payload);
      const url = this.location.prepareExternalUrl(
        this.router.serializeUrl(this.router.createUrlTree(["/account/open"]))
      );
      window.open(`${url}`, "_blank");
    }
  }
  getFileUrl(url) {
    if (url.includes("https")) {
      return "assets/images/normal_loan.svg";
    } else {
      return `${this.endPoints}${url}`;
    }
  }
}
