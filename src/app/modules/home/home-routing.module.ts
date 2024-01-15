import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { HomeComponent } from "./home.component";
import { ErrorCode401Component } from "./error/error-code-401/error-code-401.component";
import { CallbackComponent } from "./callback/callback.component";

const routes: Routes = [
  {
    path: "",
    component: HomeComponent,
  },
  {
    path: "401",
    component: ErrorCode401Component,
    data: { title: "Error401" },
  },
  {
    path: "callback",
    component: CallbackComponent,
    data: {
      title: "Callback",
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
