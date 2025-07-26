import { Component, Input } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { SidenavService } from 'app/shared/services/sidenav.service';

@Component({
  selector: 'app-document-details',
  templateUrl: './document-details.component.html',
  styleUrls: ['./document-details.component.scss'],
})
export class DocumentDetailsComponent {
  @Input() data: any;
  form: any;
  constructor(
    private fb: FormBuilder,
    private sidenav: SidenavService,
  ) {}
  ngOnInit(): void {
    console.log('response', this.data);
    this.form = this.fb.group({});

    if (Array.isArray(this.data)) {
      this.data.forEach((item: any) => {
        this.form.addControl(item.key, this.fb.control(item.value));
      });
    }
  }

  editDetails() {
    console.log('edit');
  }
  saveDetails() {
    console.log('save');
  }
  close() {
    this.sidenav.close();
  }
}
