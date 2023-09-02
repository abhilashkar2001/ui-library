import { Routes } from "@angular/router";
import { CardsComponent } from "./cards.component";

export const CardRoutes: Routes = [
  {
    path: "",
    component: CardsComponent,
    children: [
      {
        path: "",
        redirectTo: "home/account",
        pathMatch: "full",
      },
      {
        path: "home/account",
        component: CardsComponent,
      },
    ],
  },
];
