import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
// import { Router } from '@angular/router';
import { GenericValueService } from 'app/shared/services/generic-value.service';
// import { SessionStorageService } from 'app/shared/services/session-storage.service';

@Component({
  selector: 'app-account-selection',
  templateUrl: './account-selection.component.html',
  styleUrls: ['./account-selection.component.scss'],
})
export class AccountSelectionComponent {
  accountTypes = [
    {
      key: 'Self',
      title: 'Individual Account',
      description:
        'An account exclusively for one person, giving you full control.',
      img: 'individual2.svg',
    },
    {
      key: 'Joint',
      title: 'Joint Account',
      description:
        'An account exclusively for one person, giving you full control to manage.',
      img: 'joint2.svg',
    },
    {
      key: 'Minor',
      title: 'Minor Account',
      description:
        'An account exclusively for one person, giving you full control to manage.',
      img: 'minor2.svg',
    },
  ];
  staticData = {
    HOLDERTYPE: [],
  };
  genericValue: any | undefined;

  constructor(
    private dialogRef: MatDialogRef<AccountSelectionComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    // private router: Router,
    // private sessionStorageService: SessionStorageService,
    private genericValueService: GenericValueService,
  ) {}

  ngOnInit() {
    this.fetchGenericValues();
  }

  // fetch Generic Method
  fetchGenericValues() {
    this.genericValueService
      .loadGenericValue(Object.keys(this.staticData))
      .subscribe((resp: any) => {
        if (resp?.statusCode === 200) {
          this.genericValue = resp?.data;
          console.log(this.genericValue);
        }
      });
  }

  selectAccountType(type: string) {
    const holderTypeId = this.genericValue?.HOLDERTYPE?.find(
      (item: any) => item.values === type,
    )?.id;
    const data = { type: type, holderTypeId: holderTypeId, ...this.data };
    console.log(data);
    this.dialogRef.close(data);
    // this.dialogRef.close();
    // // localStorage.setItem('account-type', type);
    // localStorage.setItem(
    //   'account-type',
    //   JSON.stringify({
    //     id: holderTypeId,
    //     key: type,
    //   }),
    // );
    // this.sessionStorageService.setItem('category', this.data?.category);
    // this.sessionStorageService.setItem('basisClass', this.data.basisClass);
    // // this.router.navigate(['loan/login']);
  }
}
