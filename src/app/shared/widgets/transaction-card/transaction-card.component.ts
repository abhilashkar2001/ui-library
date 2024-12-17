import { Component, Inject, Input, OnInit, Optional } from '@angular/core';
import { Router } from '@angular/router';
import { TransactionCardConstant } from './transaction-card.constants';
import { IconService } from 'app/shared/services/icon.service';
import { TokenStorageService } from 'app/shared/token-storage.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TabModel, Tabs } from 'app/shared/models/tab-model';

@Component({
  selector: 'app-transaction-card',
  templateUrl: './transaction-card.component.html',
  styleUrls: ['./transaction-card.component.scss'],
})
export class TransactionCardComponent implements OnInit {
  @Input() transactionList: Partial<TabModel>[] =
    TransactionCardConstant.transactionCard;
  selectedTab: TabModel | undefined;
  constructor(
    private iconService: IconService,
    private router: Router,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: TabModel[],
    @Optional() private dialogRef: MatDialogRef<TransactionCardComponent>,
    private tokenStorageService: TokenStorageService,
  ) {}

  ngOnInit(): void {
    if (Array.isArray(this.data) && this.data.length > 0) {
      if (this.selectedTab) {
        this.selectedTab = this.data[0];
        if (this.selectedTab?.childTabs)
          this.addSvgIcon(this.selectedTab?.childTabs);
      } else if (this.transactionList?.length > 0) {
        this.selectedTab = this.transactionList[0] as TabModel;
        if (this.selectedTab?.childTabs)
          this.addSvgIcon(this.selectedTab.childTabs);
      }
    }
  }

  /**
   * Add svg icon to mat icon registry, if it is not present in mat icon registry
   */
  addSvgIcon(item: TabModel[] | Tabs | TabModel) {
    if (Array.isArray(item)) {
      item.forEach((item) => {
        this.iconService
          .addIconIfNotExists(item?.icon, item?.src)
          .subscribe((exists) => {
            if (exists) {
              console.log(`Icon ${item?.icon} already exists.`);
            } else {
              console.log(`Icon ${item?.icon} was added.`);
            }
          });

        this.iconService
          .addIconIfNotExists(item?.selectedIcon, item?.selectedSrc)
          .subscribe((exists) => {
            if (exists) {
              console.log(`Icon ${item?.selectedIcon} already exists.`);
            } else {
              console.log(`Icon ${item?.selectedIcon} was added.`);
            }
          });
      });
    }
  }

  /**
   * On click on any quick link it will navigate to that particular screen
   * @param route route of the quick link
   */
  route(route: string | undefined) {
    this.router.navigate([route]).then(() => {
      if (this.dialogRef) this.dialogRef.close();
    });
  }

  navigate(route: string, screenName: string) {
    if (screenName == 'Tracking')
      window.open(
        `${route}?route=tracking&code=${this.tokenStorageService.getToken()}`,
      );
    else window.open(route);
  }
}
