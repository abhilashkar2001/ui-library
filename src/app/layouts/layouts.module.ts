import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { AuthLayoutComponent } from './auth-layout/auth-layout.component';
import { SharedModule } from 'app/shared/shared.module';
import { SharedMaterialModule } from 'app/shared/shared-material.module';
import { PerfectScrollbarModule } from 'app/shared/components/perfect-scrollbar';
import { RouterModule } from '@angular/router';
import { UserLayoutComponent } from './user-layout/user-layout.component';

@NgModule({
  declarations: [
    AdminLayoutComponent,
    AuthLayoutComponent,
    UserLayoutComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    SharedMaterialModule,
    PerfectScrollbarModule,
  ],
})
export class LayoutsModule {}
