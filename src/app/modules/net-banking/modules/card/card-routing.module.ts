import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'credit-card',
    pathMatch: 'full',
  },
  {
    path: 'credit-card',
    loadChildren: () =>
      import('./credit-card/credit-card.module').then(
        (m) => m.CreditCardModule,
      ),
  },
  {
    path: 'debit-card',
    loadChildren: () =>
      import('./debit-card/debit-card.module').then((m) => m.DebitCardModule),
  },
  {
    path: 'prepaid-card',
    loadChildren: () =>
      import('./prepaid-card/prepaid-card.module').then(
        (m) => m.PrepaidCardModule,
      ),
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CardRoutingModule {}
