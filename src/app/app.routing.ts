import { Routes } from "@angular/router";
import { AdminLayoutComponent } from "./layouts/admin-layout/admin-layout.component";
import { AuthLayoutComponent } from "./layouts/auth-layout/auth-layout.component";
import { AuthGuard } from "./shared/guards/auth.guard";

export const rootRouterConfig: Routes = [
  {
    path: "",
    redirectTo: "deposits/home",
    pathMatch: "full",
  },
  {
    path: "",
    component: AdminLayoutComponent,
    children: [
      {
        path: "createAccount",
        loadChildren: () =>
          import("./views/home/create-account/create-account.module").then(
            (m) => m.CreateAccountModule
          ),
        data: { preload: false, title: "Home", breadcrumb: "Home" },
      },
      {
        path: "card",
        loadChildren: () =>
          import("./views/home/cards/card.module").then((m) => m.CardModule),
        data: { preload: false, title: "Home", breadcrumb: "Home" },
      },
      {
        path: "deposits",
        loadChildren: () =>
          import("./views/home/new-deposit/new-deposit.module").then(
            (m) => m.NewDepositModule
          ),
        data: { preload: false, title: "Home", breadcrumb: "Home" },
      },
      {
        path: "loan",
        loadChildren: () =>
          import("./views/home/loans/loan.module").then((m) => m.LoanModule),
        data: { preload: false, title: "Home", breadcrumb: "Home" },
      },
    ],
  },
  {
    path: "**",
    redirectTo: "home",
  },
];
