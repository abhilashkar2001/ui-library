import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CreateAccountComponent } from "./create-account/create-account.component";
import { RouterModule } from "@angular/router";
import { HomeRoutes } from "./create-account-routing";
import { LandingPageComponent } from "./create-account/landing-page/landing-page.component";
import { FlexLayoutModule } from "@angular/flex-layout";
import { MatButtonModule } from "@angular/material/button";

@NgModule({
  declarations: [CreateAccountComponent, LandingPageComponent],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatButtonModule,
    RouterModule.forChild(HomeRoutes),
  ],
})
export class CreateAccountModule {}
