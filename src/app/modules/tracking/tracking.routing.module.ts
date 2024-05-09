import { Routes } from "@angular/router";
import { TrackingComponent } from "./tracking.component";
import { TrackingSummaryComponent } from "./tracking-summary/tracking-summary.component";
import { SigninTrackComponent } from "./signin-track/signin-track.component";
import * as path from "path";
import { ProductListCardComponent } from "./components/product-list-card/product-list-card.component";
import { ProductDetailsComponent } from "./components/product-details/product-details.component";

export const TrackingRoute: Routes = [
  {
    path: "",
    component: TrackingComponent,
    children: [
      {
        path: "",
        component: SigninTrackComponent,
        pathMatch: "full",
      },
      {
        path: "summary",
        component: TrackingSummaryComponent,
        children: [
          {
            path: "",
            component: ProductListCardComponent,
          },
          {
            path: ":id",
            component: ProductDetailsComponent,
          },
        ],
      },
    ],
  },
];
