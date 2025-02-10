import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-error-code-401',
  templateUrl: './error-code-401.component.html',
  styleUrls: ['./error-code-401.component.scss'],
})
export class ErrorCode401Component {
  constructor(private router: Router) {}

  back(): void {
    this.router.navigate(['/home']);
  }
}
