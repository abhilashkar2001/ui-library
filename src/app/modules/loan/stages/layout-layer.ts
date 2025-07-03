import { AbstractControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { OnInit } from '@angular/core';

export abstract class LayoutBaseLayer<T = any> implements OnInit {
  abstract readonly id: string;
  abstract handleSubmit(): Observable<any>;
  abstract readonly _formGroup: FormGroup<{
    [K in keyof T]: AbstractControl<any, any>;
  }>;

  ngOnInit(): void {
    this.onInit();
  }

  protected onInit(): void {}
}
