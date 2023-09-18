import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Location } from "@angular/common";
import { environment } from "environments/environment";

@Component({
  selector: "app-account-type-details",
  templateUrl: "./account-type-details.component.html",
  styleUrls: ["./account-type-details.component.scss"],
})
export class AccountTypeDetailsComponent implements OnChanges, OnInit {
  @Input() subClassList;
  basisClass: any = "";
  endPoints = environment.microServiceURL;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location
  ) {
    this.basisClass = this.route.snapshot.params["id"];
  }

  ngOnInit(): void {}
  ngOnChanges(changes: SimpleChanges): void {
    this.subClassList = changes?.subClassList?.currentValue;
  }

  apply(clasDetails) {
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
  getFileUrl(url) {
    if (url.includes("https")) {
      return "assets/images/normal_loan.svg";
    } else {
      return `${this.endPoints}${url}`;
    }
  }
}
