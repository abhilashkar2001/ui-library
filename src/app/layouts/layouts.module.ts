import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AdminLayoutComponent } from "./admin-layout/admin-layout.component";
import { AuthLayoutComponent } from "./auth-layout/auth-layout.component";
import { SharedModule } from "app/shared/shared.module";
import { SharedMaterialModule } from "app/shared/shared-material.module";
import { RouterModule } from "@angular/router";
import { PerfectScrollbarModule } from "app/shared/components/perfect-scrollbar";

@NgModule({
  declarations: [AdminLayoutComponent, AuthLayoutComponent],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    SharedMaterialModule,
    PerfectScrollbarModule,
  ],
})
export class LayoutsModule {}
