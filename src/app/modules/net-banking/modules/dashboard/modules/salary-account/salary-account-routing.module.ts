import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AddSalaryAccountComponent } from "./add-salary-account/add-salary-account.component";
import { SalaryAccountComponent } from "./salary-account/salary-account.component";

const routes: Routes = [
  {
    path: "",
    redirectTo: "salary-account",
    pathMatch: "full",
  },

  {
    path: "add-salary",
    component: AddSalaryAccountComponent,
  },
  {
    path: "salary-account",
    component: SalaryAccountComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SalaryAccountRoutingModule {}
