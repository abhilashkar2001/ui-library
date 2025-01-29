import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FontSizeDirective } from './font-size.directive';
import { ScrollToDirective } from './scroll-to.directive';
import { AppDropdownDirective } from './dropdown.directive';
import { DropdownAnchorDirective } from './dropdown-anchor.directive';
import { DropdownLinkDirective } from './dropdown-link.directive';
import {
  EgretSidenavHelperDirective,
  EgretSidenavTogglerDirective,
} from './egret-sidenav-helper/egret-sidenav-helper.directive';
import { AutoFocusDirective } from './auto-focus.directive';
import { NumberDirective } from './number-only.directive';
import { AlphabetOnlyDirective } from './alphabet-only.directive';
import { AlphaNumericDirective } from './alphaNumeric.directive';
import { DragDropDirective } from './drag-drop.directive';
import { AlphaBetSpaceDirective } from './alphabet-space-directive';
import { NoLeadingSpaceDirective } from './no-leading-space.directive';
import { DecimalInputDirective } from './decimal-input.directive';
import { NoSpaceDirective } from './noSpace.directive';
import { AppHostDirective } from './app-host.directive';
import { MinMaxDirective } from './restrictNum-directive';
import { IcImgFallbackDirective } from './ic-img-fallback.directive';
import { WebhostDirective } from './appHost.directive';

const directives = [
  AutoFocusDirective,
  FontSizeDirective,
  ScrollToDirective,
  AppDropdownDirective,
  DropdownAnchorDirective,
  DropdownLinkDirective,
  EgretSidenavHelperDirective,
  EgretSidenavTogglerDirective,
  NumberDirective,
  AlphabetOnlyDirective,
  AlphaNumericDirective,
  DragDropDirective,
  AlphaBetSpaceDirective,
  NoLeadingSpaceDirective,
  DecimalInputDirective,
  NoSpaceDirective,
  AppHostDirective,
  MinMaxDirective,
  WebhostDirective,
  IcImgFallbackDirective,
];

@NgModule({
  imports: [CommonModule],
  declarations: directives,
  exports: directives,
})
export class SharedDirectivesModule {}
