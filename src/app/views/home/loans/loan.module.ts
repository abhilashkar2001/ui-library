import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { LoanRoutes } from "./loan-routing";

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(LoanRoutes)],
})
export class LoanModule {}
