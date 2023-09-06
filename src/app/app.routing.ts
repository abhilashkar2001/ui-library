import { Routes } from "@angular/router";
import { AdminLayoutComponent } from "./layouts/admin-layout/admin-layout.component";

export const rootRouterConfig: Routes = [
  {
    path: "",
    redirectTo: "account",
    pathMatch: "full",
  },
  {
    path: "",
    component: AdminLayoutComponent,
    children: [
      {
        path: "account",
        loadChildren: () =>
          import("./modules/create-account/create-account.module").then(
            (m) => m.CreateAccountModule
          ),
        data: { preload: false, title: "Home", breadcrumb: "Home" },
      },
      {
        path: "card",
        loadChildren: () =>
          import("./modules/cards/cards.module").then((m) => m.CardsModule),
        data: { preload: false, title: "Home", breadcrumb: "Home" },
      },
      {
        path: "deposits",
        loadChildren: () =>
          import("./modules/new-deposit/new-deposit.module").then(
            (m) => m.NewDepositModule
          ),
        data: { preload: false, title: "Home", breadcrumb: "Home" },
      },
      {
        path: "loan",
        loadChildren: () =>
          import("./modules/loans/loans.module").then((m) => m.LoansModule),
        data: { preload: false, title: "Home", breadcrumb: "Home" },
      },
    ],
  },
  {
    path: "**",
    redirectTo: "/account",
  },
];
