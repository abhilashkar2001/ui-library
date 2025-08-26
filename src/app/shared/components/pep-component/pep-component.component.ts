import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-pep-component',
  templateUrl: './pep-component.component.html',
  styleUrls: ['./pep-component.component.scss'],
})
export class PepComponentComponent implements OnInit {
  @Input() updateParentModel:
    | ((part: Partial<any>, isValid: boolean, Index: any) => void)
    | undefined;
  @Input() selectedIndex: number | undefined;
  @Input() pepInfo: string | undefined;
  pepStatusForm: FormGroup | undefined;
  @Output() PepStatus = new EventEmitter<string>();
  pepStatusFields: any[] = [
    {
      label: 'Politically Exposed Person (PEP)',
      value: 'ispoliticalPersion',
      description:
        'Secure and manage your funds easily with M-pesa during low balance situations',
    },
    {
      label: 'Related to a Politically Exposed Person (PEP)',
      value: 'isrelatedtoPoliticalperson',
      description:
        'Pay with cash directly at the counter for a quick and easy transaction.',
    },
    {
      label: 'Not Applicable',
      value: 'notApplicable',
      description:
        'Amount is auto-debited from your account for smooth, hassle-free payments.',
    },
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.buildPepForm();
    if (this.pepInfo) {
      this.pepStatusForm?.get(this.pepInfo)?.setValue(this.pepInfo);
    } else {
      this.pepStatusForm?.get('notApplicable')?.setValue(true);
    }
  }

  buildPepForm(item?: any) {
    this.pepStatusForm = this.fb.group({
      ispoliticalPersion: [item?.ispoliticalPersion ?? false],
      isrelatedtoPoliticalperson: [item?.isrelatedtoPoliticalperson ?? false],
      notApplicable: [item?.notApplicable ?? false],
    });

    this.pepStatusForm.valueChanges.subscribe((val) => {
      const selectedValue = this.getSelectedValue(val);
      this.PepStatus.emit(selectedValue);
    });
  }

  /**This function is for selecting the value and pass in the payload if valuechanges */
  getSelectedValue(values: any) {
    for (const field of this.pepStatusFields) {
      if (values[field.value]) {
        return field.value;
      }
    }
    return null;
  }

  onToggle(value: string) {
    for (const field of this.pepStatusFields) {
      if (field.value !== value) {
        this.pepStatusForm?.get(field.value)?.setValue(false);
      }
    }
    this.pepStatusForm
      ?.get(value)
      ?.setValue(!this.pepStatusForm?.get(value)?.value);
  }
}
