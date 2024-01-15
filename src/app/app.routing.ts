import { Routes } from "@angular/router";
import { AdminLayoutComponent } from "./layouts/admin-layout/admin-layout.component";
import { AuthGuard } from "./shared/guards/auth.guard";

export const rootRouterConfig: Routes = [
  {
    path: "",
    redirectTo: "home",
    pathMatch: "full",
  },
  {
    path: "home",
    loadChildren: () =>
      import("./modules/home/home.module").then((m) => m.HomeModule),
    data: { title: "Loading" },
  },
  {
    path: "origination",
    loadChildren: () =>
      import(
        "./modules/origination-external-callback/origination-external-callback.module"
      ).then((m) => m.OriginationExternalCallbackModule),
    data: { preload: false, title: "Home", breadcrumb: "Home" },
  },
  {
    path: "",
    component: AdminLayoutComponent,
    canActivate: [AuthGuard],
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
    redirectTo: "home/404",
  },
];
