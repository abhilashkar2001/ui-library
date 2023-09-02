import { Routes } from "@angular/router";
import { LoansComponent } from "./loans.component";

export const LoanRoutes: Routes = [
  {
    path: "",
    component: LoansComponent,
    children: [
      {
        path: "",
        redirectTo: "home/account",
        pathMatch: "full",
      },
      {
        path: "home/account",
        component: LoansComponent,
      },
    ],
  },
];
