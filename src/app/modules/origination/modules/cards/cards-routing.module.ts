import { Routes } from '@angular/router';
import { CardLandingComponent } from './card-landing/card-landing.component';
import { CardTypeComponent } from './card-type/card-type.component';
import { CardsComponent } from './cards.component';
import { CreateCardLandingPageComponent } from './create-card-landing-page/create-card-landing-page.component';

export const cardsRoutes: Routes = [
  {
    path: '',
    component: CardsComponent,
    children: [
      {
        path: '',
        redirectTo: 'landing',
        pathMatch: 'full',
      },
      {
        path: 'landing',
        component: CardLandingComponent,
      },

      {
        path: 'card-type',
        component: CardTypeComponent,
      },
      {
        path: 'mobile-verification',
        component: CreateCardLandingPageComponent,
      },
    ],
  },
];
