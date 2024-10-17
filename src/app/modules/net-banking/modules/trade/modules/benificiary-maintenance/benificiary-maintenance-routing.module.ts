import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AddEditBenificiaryComponent } from "./add-edit-benificiary/add-edit-benificiary.component";
import { BeneficiarySummaryComponent } from "./beneficiary-summary/beneficiary-summary.component";
import { BeneficiaryBulkUploadComponent } from "./beneficiary-bulk-upload/beneficiary-bulk-upload.component";
import { BenificiaryBulkUploadSummaryComponent } from "./benificiary-bulk-upload-summary/benificiary-bulk-upload-summary.component";

const routes: Routes = [
  {
    path: "",
    redirectTo: "summary",
    pathMatch: "full",
  },
  {
    path: "summary",
    component: BeneficiarySummaryComponent,
  },
  {
    path: "add-edit-beneficiary",
    component: AddEditBenificiaryComponent,
  },
  {
    path: "bulk-upload/:id",
    component: BeneficiaryBulkUploadComponent,
  },
  {
    path: "bulk-upload",
    component: BenificiaryBulkUploadSummaryComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BenificiaryMaintenanceRoutingModule {}
