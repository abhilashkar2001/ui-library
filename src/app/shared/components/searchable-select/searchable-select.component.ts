import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';

@Component({
  selector: 'app-searchable-select',
  templateUrl: './searchable-select.component.html',
  styleUrls: ['./searchable-select.component.scss'],
})
export class SearchableSelectComponent implements OnChanges {
  filterFormControl: FormControl = new FormControl('');
  @Input() control: AbstractControl = new FormControl();
  @Input() items: any[] | any;
  @Input() searchPlaceholder = 'Search';
  @Input() bindValueKey: string | any;
  @Input() bindLabelKey: string | any;
  @Input() inputLabel: string | any;
  @Input() readonly: boolean | any;
  @Input() multiple = false;
  @Input() customClass = '';
  @Input() skipLabel = false;
  @Input() duplicateValue = false;
  @Input() customDocOptionWidth = '';
  @Input() customInputHeight: string | any;
  @Input() displayLabel: string | any;
  @Input() showOutsideLabel: any = false;
  @Input() currencyCode: any;

  @Output() selectionChange = new EventEmitter();

  ngOnChanges(changes: SimpleChanges | any): void {
    if (changes?.items && this.bindLabelKey && this.bindValueKey) {
      this.items = changes?.items?.currentValue
        ?.map((i: any) => ({
          label: i[this.bindLabelKey] ?? i,
          value: i[this.bindValueKey] ?? i,
          display: i[this.displayLabel] ?? i,
          disabled: i?.disabled ?? false,
        }))
        .sort((a: any, b: any) => {
          const labelA = String(a.label);
          const labelB = String(b.label);
          return labelA.localeCompare(labelB);
        });
    }
  }

  trimWhitespaces(value: any) {
    if (value.trim()) return;
  }
}
