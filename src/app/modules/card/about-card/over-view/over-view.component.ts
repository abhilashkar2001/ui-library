import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-over-view',
  templateUrl: './over-view.component.html',
  styleUrls: ['./over-view.component.scss'],
})
export class OverViewComponent {
  @Input() title!: any;
  @Input() description!: any;
  @Input() cardInfo!: any;
  @Input() keyHighLights!: any;
}
