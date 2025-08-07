import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { SidenavService } from 'app/shared/services/sidenav.service';

@Component({
  selector: 'app-document-details',
  templateUrl: './document-details.component.html',
  styleUrls: ['./document-details.component.scss'],
})
export class DocumentDetailsComponent {
  @Input() data: any;
  @Output() documentSubmit = new EventEmitter();
  form: any;
  constructor(
    private fb: FormBuilder,
    private sidenav: SidenavService,
  ) {}
  ngOnInit(): void {
    this.form = this.fb.group({});

    if (Array.isArray(this.data)) {
      this.data.forEach((item: any) => {
        this.form.addControl(
          this.convertLabel(item.label),
          this.fb.control(item.value),
        );
      });
    }
  }

  convertLabel(label: string): string {
    return label?.includes(' ')
      ? label?.toLowerCase().replace(/\s+/g, '')
      : label?.toLowerCase();
  }

  saveDetails() {
    this.documentSubmit.emit(this.form.value);
    this.sidenav.close();
  }

  close() {
    this.sidenav.close();
  }
}
