import { Component, Input } from '@angular/core';
import { AbstractControl, FormArray, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-document-details',
  templateUrl: './document-details.component.html',
  styleUrls: ['./document-details.component.scss'],
})
export class DocumentDetailsComponent {
  @Input() data: any;
  ngOnChanges(): void {}
  
  get flatControls(): { group: FormGroup; key: string }[] {
    const result: { group: FormGroup; key: string }[] = [];
    if (this.data && this.data instanceof FormArray) {
      this.data.controls.forEach((group: AbstractControl) => {
        if (group instanceof FormGroup) {
          const keys = Object.keys(group.controls);
          keys.forEach((key) => {
            result.push({ group, key });
          });
        }
      });
    }
    return result;
  }

  editDetails() {
    console.log('edit');
  }
  saveDetails() {
    console.log('save');
  }
}
