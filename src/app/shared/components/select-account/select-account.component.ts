import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-select-account',
  templateUrl: './select-account.component.html',
  styleUrls: ['./select-account.component.scss'],
})
export class SelectAccountComponent {
  @Input() data: any;

  ngOnInit(): void {}
}
