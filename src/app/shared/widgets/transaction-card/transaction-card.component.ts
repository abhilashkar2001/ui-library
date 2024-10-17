import { Component, Inject, Input, OnInit, Optional } from '@angular/core';
import { TransactionCardConstant } from './transaction-card.constants';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UILibIconService } from 'app/shared/services/ui-lib-icon.service';
import { IconService } from 'app/shared/services/icon.service';

@Component({
  selector: 'app-transaction-card',
  templateUrl: './transaction-card.component.html',
  styleUrls: ['./transaction-card.component.scss']
})
export class TransactionCardComponent implements OnInit {
  @Input("transactionList") transactionList =
    TransactionCardConstant.transactionCard;
  selectedTab;

  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    // @Optional() private dialogRef: MatDialogRef<TransactionCardComponent>,
    private iconService: IconService,
  ) { }

  ngOnInit(): void {
    if (this.data) {
      this.selectedTab = this.data[0];
      console.log(this.selectedTab, "checkkkk");
      this.addSvgIcon(this.selectedTab?.childTab);
    } else if (this.transactionList?.length > 0) {
      this.selectedTab = this.transactionList[0];
      this.addSvgIcon(this.selectedTab?.childTab);
    }
  }

  /**
 * Add svg icon to mat icon registry, if it is not present in mat icon registry
 */
  addSvgIcon(item) {
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
