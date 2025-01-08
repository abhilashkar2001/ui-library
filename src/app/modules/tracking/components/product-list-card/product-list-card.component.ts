import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TrackingService } from '../../tracking-service';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { ProductListConstant } from './product-list-card.constant';
import { SessionStorageService } from 'app/shared/services/session-storage.service';

@Component({
  selector: 'app-product-list-card',
  templateUrl: './product-list-card.component.html',
  styleUrls: ['./product-list-card.component.scss'],
})
export class ProductListCardComponent implements OnInit {
  productList: any = [];
  searchFilter = ProductListConstant.DEFAULT_CATEGORIES;
  categoryList = ProductListConstant.CATEGORY_LIST;
  searchControl: FormControl = new FormControl('');
  searchParam = '';

  constructor(
    private route: Router,
    private api: TrackingService,
    private sessionStorageService: SessionStorageService,
  ) {}

  ngOnInit(): void {
    this.searchControl.valueChanges
      .pipe(debounceTime(500))
      .subscribe((resp) => {
        this.searchParam = resp;
        this.getProductList();
      });
    this.getProductList();
  }

  /**
   * api call to fetch all products.
   */
  getProductList() {
    const filterItem = {
      category:
        this.searchFilter === ProductListConstant.DEFAULT_CATEGORIES
          ? ''
          : this.searchFilter,
      searchParam: this.searchParam,
    };
    this.api
      .getProductList(
        parseInt(this.sessionStorageService.getTrackingMobile()),
        filterItem,
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
    this.getProductList();
  }

  /**
   * routing to see product details.
   * @param product product info
   */
  openProduct(product: any) {
    this.route.navigate([`tracking/summary/${product?.originationId}`], {
      queryParams: { type: product.type },
    });
  }

  /**
   *
   * @param status status
   * @returns a class according to status.
   */
  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'highlightPending';
      case 'ongoing':
        return 'highlightOngoing';
      case 'approved':
        return 'highlightApproved';
      case 'rejected':
        return 'highlightRejected';
      case 'expired':
        return 'highlightExpired';
      default:
        return '';
    }
  }

  /**
   * a trackBy method.
   * @param index
   * @param product
   * @returns
   */
  trackByProductId(index: number) {
    return index;
  }
}
