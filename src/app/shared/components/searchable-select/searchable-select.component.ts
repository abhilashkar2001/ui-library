import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from "@angular/core";
import { AbstractControl, FormControl } from "@angular/forms";

@Component({
  selector: "app-searchable-select",
  templateUrl: "./searchable-select.component.html",
  styleUrls: ["./searchable-select.component.scss"],
})
export class SearchableSelectComponent implements OnInit, OnChanges {
  filterFormControl: FormControl = new FormControl("");
  @Input() control: AbstractControl = new FormControl();
  @Input() items: any[];
  @Input() searchPlaceholder: string = "Search";
  @Input() bindValueKey: string;
  @Input() bindLabelKey: string;
  @Input() inputLabel: string;
  @Input() readonly: boolean;
  @Input() multiple: boolean = false;
  @Input() customClass: string = "";
  @Input() skipLabel: boolean = false;
  @Input() duplicateValue: boolean = false;
  @Input() customDocOptionWidth: string = "";
  @Input() customInputHeight: string;
  @Input() displayLabel: string;

  @Output() selectionChange = new EventEmitter();

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.items && this.bindLabelKey && this.bindValueKey) {
      this.items = changes?.items?.currentValue
        ?.map((i) => ({
          label: i[this.bindLabelKey] ?? i,
          value: i[this.bindValueKey] ?? i,
          display: i[this.displayLabel] ?? i,
          disabled: i?.disabled ?? false,
        }))
        .sort((a, b) => {
          const labelA = String(a.label);
          const labelB = String(b.label);
  
          return labelA.localeCompare(labelB);
        });
    }
  }
  

  ngOnInit(): void {}

  trimWhitespaces(value) {
    if (!!value.trim()) return;
  }
}
