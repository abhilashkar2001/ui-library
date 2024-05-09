import { Component, Input, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { TrackingService } from "../../tracking-service";

@Component({
  selector: "app-product-list-card",
  templateUrl: "./product-list-card.component.html",
  styleUrls: ["./product-list-card.component.scss"],
})
export class ProductListCardComponent implements OnInit {
  productList = [];
  searchFilter = "All Categories";
  constructor(private route: Router, private api: TrackingService) {}

  ngOnInit(): void {
    this.getProductList();
  }

  getProductList() {
    this.api
      .getProductList(parseInt(sessionStorage.getItem("trackingMobile")))
      .subscribe((resp) => {
        if (resp?.statusCode === 200) {
          this.productList = resp.data;
        }
      });
  }

  openProduct(product) {
    this.route.navigate([`tracking/summary/${product?.originationId}`]);
  }
}
