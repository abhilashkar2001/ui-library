import { Routes } from "@angular/router";
import { CreateAccountComponent } from "./create-account/create-account.component";
import { LandingPageComponent } from "./create-account/landing-page/landing-page.component";

export const HomeRoutes: Routes = [
  {
    path: "",
    component: CreateAccountComponent,
    children: [
      {
        path: "",
        redirectTo: "home/account",
        pathMatch: "full",
      },
      // {
      //   path: "home/account",
      //   component: CreateAccountComponent,
      // },
      {
        path: "home/account",
        component: LandingPageComponent,
      },
    ],
  },
];
