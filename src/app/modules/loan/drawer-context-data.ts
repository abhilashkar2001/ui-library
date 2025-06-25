import { Type } from '@angular/core';

export class DrawerContextData {
  constructor(
    public component: Type<any>,
    public data: any,
  ) {}
}
