import { Routes } from "@angular/router";
import { AdminLayoutComponent } from "./layouts/admin-layout/admin-layout.component";
import { AuthGuard } from "./shared/guards/auth.guard";
import { UserLayoutComponent } from "./layouts/user-layout/user-layout.component";
import { AuthLayoutComponent } from "./layouts/auth-layout/auth-layout.component";

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
    component: AuthLayoutComponent,
    children: [
      {
        path: "sessions",
        loadChildren: () =>
          import("./modules/sessions/sessions.module").then(
            (m) => m.SessionsModule
          ),
      },
    ],
  },
  {
    path: "user",
    component: UserLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: "dashboard",
        loadChildren: () =>
          import("./modules/net-banking/net-banking.module").then(
            (m) => m.NetBankingModule
          ),
      },
      {
        path: "net-banking",
        loadChildren: () =>
          import("./modules/net-banking/net-banking.module").then(
            (m) => m.NetBankingModule
          ),
        data: {
          preload: false,
          title: "Net Banking",
          breadcrumb: "net-banking",
        },
      },
    ],
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
