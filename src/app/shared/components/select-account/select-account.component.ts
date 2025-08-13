import { Component, Input } from '@angular/core';
import { AdminLayoutComponent } from 'app/layouts/admin-layout/admin-layout.component';

@Component({
  selector: 'app-select-account',
  templateUrl: './select-account.component.html',
  styleUrls: ['./select-account.component.scss'],
})
export class SelectAccountComponent {
  @Input() data: any;

  constructor(private adminLayout: AdminLayoutComponent) {}
  ngOnInit(): void {}
  close() {
    this.adminLayout.closeSidenav();
  }
}
