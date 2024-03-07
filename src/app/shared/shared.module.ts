import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

// SERVICES
import { ThemeService } from "./services/theme.service";
import { NavigationService } from "./services/navigation.service";
import { RoutePartsService } from "./services/route-parts.service";
import { AuthGuard } from "./guards/auth.guard";
import { AppConfirmService } from "./services/app-confirm/app-confirm.service";
import { AppLoaderService } from "./services/app-loader/app-loader.service";

import { SharedComponentsModule } from "./components/shared-components.module";
import { SharedPipesModule } from "./pipes/shared-pipes.module";
import { SharedDirectivesModule } from "./directives/shared-directives.module";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { ReactiveFormsModule } from "@angular/forms";
import { NgOtpInputModule } from "ng-otp-input";
import { NetBankUserGaurd } from "./guards/netBankUserAuth.gaurd";

@NgModule({
  imports: [
    CommonModule,
    SharedComponentsModule,
    SharedPipesModule,
    SharedDirectivesModule,
    NgOtpInputModule,
  ],
  providers: [
    ThemeService,
    NavigationService,
    RoutePartsService,
    AuthGuard,
    AppConfirmService,
    AppLoaderService,
    ReactiveFormsModule,
    NgbModule,
    NetBankUserGaurd,
  ],
  exports: [SharedComponentsModule, SharedPipesModule, SharedDirectivesModule],
})
export class SharedModule {}
