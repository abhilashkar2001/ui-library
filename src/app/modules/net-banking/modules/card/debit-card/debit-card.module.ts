import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DebitCardServiceComponent } from "./debit-card-service/debit-card-service/debit-card-service.component";
import { DebitCardRoutingModule } from "./debit-card-routing.module";
import { ManageDebitCardComponent } from './manage-debit-card/manage-debit-card.component';

@NgModule({
  declarations: [DebitCardServiceComponent, ManageDebitCardComponent],
  imports: [CommonModule, DebitCardRoutingModule],
})
export class DebitCardModule {}
