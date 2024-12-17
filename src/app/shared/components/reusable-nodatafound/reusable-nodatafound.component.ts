import { Component, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-reusable-nodatafound',
  templateUrl: './reusable-nodatafound.component.html',
  styleUrls: ['./reusable-nodatafound.component.scss'],
})
export class ReusableNodatafoundComponent {
  @Input() displayLabel: any;
  @Input() displayExternalLink: boolean | any;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
}
