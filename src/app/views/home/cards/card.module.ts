import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { CardRoutes } from "./cardt-routing";

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(CardRoutes)],
})
export class CardModule {}
