import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SigninComponent } from './signin/signin.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'signin',
        component: SigninComponent,
        data: { title: 'Signin' },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SessionsRoutingModule {}
