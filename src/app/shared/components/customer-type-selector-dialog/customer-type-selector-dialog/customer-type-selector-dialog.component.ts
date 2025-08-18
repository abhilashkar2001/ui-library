import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-customer-type-selector-dialog',
  templateUrl: './customer-type-selector-dialog.component.html',
  styleUrls: ['./customer-type-selector-dialog.component.scss'],
})
export class CustomerTypeSelectorDialogComponent {
  accountTypes = [
    {
      key: 'retail',
      title: 'Retail Account',
      description:
        'An account for individual customers with full personal control.',
      img: 'individual2.svg',
    },
    {
      key: 'corporate',
      title: 'Corporate Account',
      description:
        'An account for businesses with shared management and controls.',
      img: 'joint2.svg',
    },
  ];

  typeToggler = false;
  form: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CustomerTypeSelectorDialogComponent>,
  ) {
    this.form = this.fb.group({
      accountType: ['', Validators.required],
      accountSubtype: ['', Validators.required],
    });
  }

  selectAccountType(type: string) {
    this.form.get('accountType')?.setValue(type);
    if (type === 'retail') {
      this.typeToggler = true;
      this.form.get('accountSubtype')?.setValidators([Validators.required]);
      this.form.get('accountSubtype')?.updateValueAndValidity();
    } else {
      this.typeToggler = false;
      this.form.get('accountSubtype')?.setValue('');
      this.form.get('accountSubtype')?.clearValidators();
      this.form.get('accountSubtype')?.updateValueAndValidity();
    }
  }

  selectAccountSubtype(subtype: string) {
    this.form.get('accountSubtype')?.setValue(subtype);
  }

  closeDialog() {
    this.dialogRef.close(this.form.value);
  }
}
