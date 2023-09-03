import { Routes } from "@angular/router";
import { CreateAccountComponent } from "./create-account/create-account.component";
import { LandingPageComponent } from "./create-account/landing-page/landing-page.component";
import { CreateAccountLandingPageComponent } from "./create-account/create-account-landing-page/create-account-landing-page.component";

export const HomeRoutes: Routes = [
  {
    path: "",
    component: CreateAccountComponent,
    children: [
      {
        path: "",
        redirectTo: "landing",
        pathMatch: "full",
      },
      {
        path: "landing",
        component: LandingPageComponent,
      },
      {
        path: "open",
        component: CreateAccountLandingPageComponent,
      },
    ],
  },
];
