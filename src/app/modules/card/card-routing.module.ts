import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StagesComponent } from './stages/stages.component';
import { LoginComponent } from '../loan/login/login.component';
import { CardComponent } from './card.component';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CardRoutingModule {
  routes: Routes = [
    {
      path: '',
      component: CardComponent,
      children: [
        {
          path: '',
          redirectTo: 'login',
          pathMatch: 'full',
        },

        {
          path: 'login',
          component: LoginComponent,
        },
        {
          path: 'stages',
          component: StagesComponent,
        },
      ],
    },
  ];
}
