import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DebitCardServiceComponent } from "./debit-card-service/debit-card-service/debit-card-service.component";
import { DebitCardRoutingModule } from "./debit-card-routing.module";

@NgModule({
  declarations: [DebitCardServiceComponent],
  imports: [CommonModule, DebitCardRoutingModule],
})
export class DebitCardModule {}
