import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { OpenAccountService } from "app/shared/services/open-service/open-account.service";

@Component({
  selector: "app-apply-account",
  templateUrl: "./apply-account.component.html",
  styleUrls: ["./apply-account.component.scss"],
})
export class ApplyAccountComponent implements OnInit {
  subClassList: any[] = [];
  subClass: any;
  constructor(private api: OpenAccountService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    //this.route.queryParamMap.subscribe((params) => {
    //  console.log(params);
    console.log(this.route);
    this.subClass = this.route.snapshot.params["id"];
    console.log(this.route.snapshot.params);
    this.api.fetchSubClass(this.subClass).subscribe((resp) => {
      if (resp?.statusCode === 200)
        this.subClassList = resp.data[0]?.productDetails;
    });
  }
}
