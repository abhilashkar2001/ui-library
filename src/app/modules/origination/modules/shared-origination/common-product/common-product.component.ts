import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-common-product',
  templateUrl: './common-product.component.html',
  styleUrls: ['./common-product.component.scss'],
})
export class CommonProductComponent implements OnChanges, OnInit {
  endPoints = environment.microServiceURL;
  @Input() subAccount: any;
  @Input() productIndex = 0;
  @Output() apply = new EventEmitter<any>();
  @Output() customClassApply = new EventEmitter<any>();
  filePreview: any;

  constructor(
    private cdr: ChangeDetectorRef,
    private snackBar: MatSnackBar,
    private sanitizer: DomSanitizer,
  ) {}

  ngOnInit(): void {
    this.filePreview = this.filePreview = this.getFileUrl(
      this.subAccount.fileUrl,
    );
  }

  goForCalculator(product: any) {
    if (product?.productDetails === null) {
      this.snackBar.open('No Products Available', 'Ok', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'right',
      });
    } else if (product?.productDetails?.length == 1) {
      this.customClassApply.emit({
        clasDetails: product,
      });
    } else {
      this.apply.emit(product);
    }
  }

  readMoreLess() {
    this.subAccount.isReadMore = !this.subAccount.isReadMore;
  }

  getFileUrl(url: any) {
    if (url) {
      if (url.includes('https')) {
        return 'assets/images/normal_loan.svg';
      } else {
        return this.sanitizer.bypassSecurityTrustUrl(`${url.split('.')[0]}`);
      }
    } else return 'assets/images/normal_loan.svg';
  }

  ngOnChanges(changes: SimpleChanges | any): void {
    if (changes.productIndex)
      this.productIndex = changes.productIndex.currentValue;
    if (changes) {
      this.subAccount = Object.assign(changes.subAccount.currentValue, {
        isReadMore: false,
      });
      console.log(this.subAccount);
    }
    this.cdr.detectChanges();
  }
}
