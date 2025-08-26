import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  EgretSidenavHelperDirective,
  EgretSidenavTogglerDirective,
} from './egret-sidenav-helper/egret-sidenav-helper.directive';
import { NumberDirective } from './number-only.directive';
import { AlphabetOnlyDirective } from './alphabet-only.directive';
import { AlphaNumericDirective } from './alphaNumeric.directive';
import { AlphaBetSpaceDirective } from './alphabet-space-directive';
import { NoLeadingSpaceDirective } from './no-leading-space.directive';
import { NoSpaceDirective } from './noSpace.directive';
import { MinMaxDirective } from './restrictNum-directive';
import { WebhostDirective } from './appHost.directive';
import { NumberAnimationDirective } from './number-animation.directive';
import { DragDropDirective } from './drag-drop.directive';
import { InViewAnimateDirective } from './in-view-animate.directive';

const directives = [
  EgretSidenavHelperDirective,
  EgretSidenavTogglerDirective,
  NumberDirective,
  AlphabetOnlyDirective,
  AlphaNumericDirective,
  AlphaBetSpaceDirective,
  NoLeadingSpaceDirective,
  NoSpaceDirective,
  MinMaxDirective,
  WebhostDirective,
  NumberAnimationDirective,
  DragDropDirective,
  InViewAnimateDirective,
];

@NgModule({
  imports: [CommonModule],
  declarations: directives,
  exports: directives,
})
export class SharedDirectivesModule {}
