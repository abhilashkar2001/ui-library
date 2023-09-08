import { Component, Input, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-account-type-details",
  templateUrl: "./account-type-details.component.html",
  styleUrls: ["./account-type-details.component.scss"],
})
export class AccountTypeDetailsComponent implements OnInit {
  @Input() subClass;
  constructor(private router: Router) {}

  ngOnInit(): void {}
  apply(clasDetails) {
    const payload = JSON.stringify({
      accountType: clasDetails.basisName,
      basisDetailsId: clasDetails.basisId,
      processCycleCode: clasDetails.processCycleCode,
    });
    sessionStorage.setItem("basisDetails", payload);
    this.router.navigate(["/account/open"]);
  }
}
