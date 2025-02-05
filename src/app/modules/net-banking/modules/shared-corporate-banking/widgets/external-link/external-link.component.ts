import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TabModel } from 'app/shared/models/tab-model';
import { ReusableNodatafoundComponent } from '../../reusable-nodatafound/reusable-nodatafound.component';

@Component({
  selector: 'app-external-link',
  templateUrl: './external-link.component.html',
  styleUrls: ['./external-link.component.scss'],
})
export class ExternalLinkComponent {
  @Input() title!: string;
  @Input() storeTypes: string[] = [];
  @Input() Externaltypes: TabModel[] = [];
  @Input() types: string[] = [];
  @Input() screenName!: string;

  constructor(
    private router: Router,
    private dialog: MatDialog,
  ) {}

  route(route: string | undefined, screenName?: string) {
    if (route?.startsWith('https://')) window.open(route);
    else if (route == '')
      this.dialog.open(ReusableNodatafoundComponent, {
        data: screenName,
        width: '40%',
        height: 'auto',
        disableClose: true,
      });
    else this.router.navigate([route]);
  }
}
