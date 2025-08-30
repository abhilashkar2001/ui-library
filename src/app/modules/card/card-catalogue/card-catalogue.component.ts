import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountSelectionComponent } from 'app/modules/create-account/components/account-selection/account-selection.component';
import { LoanService } from 'app/shared/services/loan/loan.service';
import { SessionStorageService } from 'app/shared/services/session-storage.service';

@Component({
  selector: 'app-card-catalogue',
  templateUrl: './card-catalogue.component.html',
  styleUrls: ['./card-catalogue.component.scss'],
})
export class CardCatalogueComponent implements OnInit {
  cardTypes = [
    'All Cards',
    'Rewards Cards',
    'Travel Cards',
    'Fuel Cards',
    'Cashback Cards',
    'Premium / Metal Cards',
    'Lifestyle Cards',
    'Corporate Cards',
  ];
  feeRanges = [
    'All Fees',
    'Free ($0)',
    'Low ($1-$99)',
    'Medium ($100-$299)',
    'High ($300+)',
  ];
  variants = ['VISA', 'AMERICAN EXPRESS', 'MasterCard', 'RuPay'];
  aboutSectionToggler = false;
  basisClass!: string;
  category!: string;
  productList: any;
  basisId!: number;
  cards:
    | {
      title: string;
      image: string;
      benefits: string;
      joiningFee: number;
      annualFee: number;
      basisId: number;
    }[]
    | undefined;

  constructor(
    private cardService: LoanService,
    private activateRoute: ActivatedRoute,
    private dialog: MatDialog,
    private sessionStorageService: SessionStorageService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.activateRoute.queryParamMap.subscribe((params: any) => {
      this.basisClass = params.get('subClass');
      this.category = params.get('category');
    });
    this.fetchSubClassProducts();
  }

  cardAbout(){
    this.aboutSectionToggler = !this.aboutSectionToggler;
  }

  fetchSubClassProducts() {
    this.cardService
      .getSubLoanTypes(this.basisClass)
      .subscribe((response: any) => {
        this.productList = response.data.filter(
          (item: any) => !!item?.productDetails,
        );

        if (this.productList.length > 0) {
          const product = this.productList[0].productDetails[0];
          this.cards = [
            {
              title: product?.basisName || 'Card',
              image: 'assets/images/card.svg',
              benefits: product?.featureInfo?.length
                ? product.featureInfo.map((f: any) => f.description)
                : ['No benefits available'],
              joiningFee: product?.joiningFee || '₹20,000 + GST',
              annualFee: product?.annualFee || '₹20,000 + GST',
              basisId: product?.basisId,
            },
          ];
        }
      });
  }

  applyCard(selectedCard: any) {
    const dialogRef = this.dialog.open(AccountSelectionComponent, {
      width: '50%',
      height: 'auto',
      backdropClass: 'confirmDialogComponent',
      hasBackdrop: true,
      disableClose: true,
      data: {
        category: this.category,
        basisClass: this.basisClass,
        basisId: selectedCard.basisId,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;
      else
      this.sessionStorageService.setItem('category', this.category);
      this.sessionStorageService.setItem('basisClass', this.basisClass);
      this.sessionStorageService.setItem('basisId', selectedCard.basisId);
      this.goToLogin();
    });
  }

  goToLogin() {
    this.sessionStorageService.setItem('category', this.category);
    this.sessionStorageService.setItem('basisClass', this.basisClass);
    this.router.navigate(['loan/login']);
  }
}
