import { Component, Input, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { TrackingService } from "../../tracking-service";
import { FormControl } from "@angular/forms";
import { debounceTime } from "rxjs/operators";

@Component({
  selector: "app-product-list-card",
  templateUrl: "./product-list-card.component.html",
  styleUrls: ["./product-list-card.component.scss"],
})
export class ProductListCardComponent implements OnInit {
  productList = [];
  searchFilter = "All Categories";
  categoryList = ["All Categories", "Lending", "Accounts", "Card", "Deposit"];
  searchControl: FormControl = new FormControl("");
  searchParam: string = "";
  constructor(private route: Router, private api: TrackingService) {}

  ngOnInit(): void {
    this.searchControl.valueChanges
      .pipe(debounceTime(500))
      .subscribe((resp) => {
        this.searchParam = resp;
        this.getProductList({
          category:
            this.searchFilter == "All Categories" ? "" : this.searchFilter,
          searchParam: this.searchParam,
        });
      });
    this.getProductList();
  }

  getProductList(filterItem?) {
    this.api
      .getProductList(
        parseInt(sessionStorage.getItem("trackingMobile")),
        filterItem
      )
      .subscribe((resp) => {
        if (resp?.statusCode === 200) {
          this.productList = resp.data;
        } else if (resp?.statusCode === 204) {
          this.productList = [];
        }
      });
  }

  onCategoryChange() {
    this.getProductList({
      category: this.searchFilter == "All Categories" ? "" : this.searchFilter,
      searchParam: this.searchParam,
    });
  }

  openProduct(product) {
    this.route.navigate([`tracking/summary/${product?.originationId}`], {
      queryParams: { type: product.type },
    });
  }
}
