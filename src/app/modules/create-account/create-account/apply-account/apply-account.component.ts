import { Component, OnInit } from "@angular/core";
import { OpenAccountService } from "app/shared/services/open-service/open-account.service";

@Component({
  selector: "app-apply-account",
  templateUrl: "./apply-account.component.html",
  styleUrls: ["./apply-account.component.scss"],
})
export class ApplyAccountComponent implements OnInit {
  subClassList: any[] = [];
  constructor(private api: OpenAccountService) {}

  ngOnInit(): void {
    this.api.fetchSubClass().subscribe((resp) => {
      if (resp?.statusCode === 200)
        this.subClassList = resp.data[0]?.productDetails;
    });
  }
}
