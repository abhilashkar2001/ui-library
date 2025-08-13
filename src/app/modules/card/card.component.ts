import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-card',
  standalone: true,
  template: ` <router-outlet></router-outlet> `,
  imports: [RouterOutlet],
})
export class CardComponent {}
