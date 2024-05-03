import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ChequeComponent } from "./cheque/cheque.component";
import { ChequebookRequestComponent } from "./chequebook-request/chequebook-request.component";
import { ChequeStatusEnquiryComponent } from "./cheque-status-enquiry/cheque-status-enquiry.component";
import { StopChequeComponent } from "./stop-cheque/stop-cheque.component";

const routes: Routes = [
  {
    path: "",
    pathMatch: "full",
    redirectTo: "home",
  },
  {
    path: "home",
    component: ChequeComponent,
    children: [
      {
        path: "chequebook-request",
        component: ChequebookRequestComponent,
      },
      {
        path: "cheque-status-enquiry",
        component: ChequeStatusEnquiryComponent,
      },
      {
        path: "stop-cheque",
        component: StopChequeComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChequeBookRoutingModule {}
