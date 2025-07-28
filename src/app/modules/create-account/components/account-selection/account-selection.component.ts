import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SessionStorageService } from 'app/shared/services/session-storage.service';

@Component({
  selector: 'app-account-selection',
  templateUrl: './account-selection.component.html',
  styleUrls: ['./account-selection.component.scss'],
})
export class AccountSelectionComponent {
  accountTypes = [
    {
      key: 'individual',
      title: 'Individual Account',
      description:
        'An account exclusively for one person, giving you full control.',
      img: 'individual2.svg',
    },
    {
      key: 'joint',
      title: 'Joint Account',
      description:
        'An account exclusively for one person, giving you full control to manage.',
      img: 'joint2.svg',
    },
    {
      key: 'minor',
      title: 'Minor Account',
      description:
        'An account exclusively for one person, giving you full control to manage.',
      img: 'minor2.svg',
    },
  ];

  constructor(
    private dialogRef: MatDialogRef<AccountSelectionComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private router: Router,
    private sessionStorageService: SessionStorageService,
  ) {}

  selectAccountType(type: string) {
    this.dialogRef.close();
    localStorage.setItem('account-type', type);
    this.sessionStorageService.setItem('category', this.data?.category);
    this.sessionStorageService.setItem('basisClass', this.data.basisClass);
    this.router.navigate(['loan/login']);
  }
}
