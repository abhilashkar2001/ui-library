import { isPlatformServer } from '@angular/common';
import {
  Directive,
  ElementRef,
  HostListener,
  Inject,
  Input,
  NgZone,
  OnDestroy,
  Optional,
  PLATFORM_ID,
  Renderer2,
  Self,
} from '@angular/core';
import { AbstractControl, ControlValueAccessor, NgControl, ValidationErrors, Validator } from '@angular/forms';
import type Inputmask from 'inputmask';
import _Inputmask from 'inputmask';

import { InputmaskOptions } from './types';
import { INPUT_MASK_CONFIG, InputMaskConfig } from './config';

const InputmaskConstructor =
  (_Inputmask as unknown as { default?: Inputmask.Static }).default ||
  _Inputmask;

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[inputMask]',
})
export class InputMaskDirective<T = any>
  implements OnDestroy, ControlValueAccessor, Validator
{
  // eslint-disable-next-line @typescript-eslint/naming-convention
  static ngAcceptInputType_inputMask: InputmaskOptions<any> | null | undefined;

  /**
   * Helps you to create input-mask based on https://github.com/RobinHerbots/Inputmask
   * Supports form-validation out-of-the box.
   * Visit https://github.com/ngneat/input-mask for more info.
   */
  @Input()
  set inputMask(inputMask: InputmaskOptions<T> | null | undefined) {
    if (inputMask) {
      this.inputMaskOptions = inputMask;
      this.updateInputMask();
    }
  }

  inputMaskPlugin: Inputmask.Instance | null = null;
  nativeInputElement: HTMLInputElement | null = null;
  defaultInputMaskConfig = new InputMaskConfig();

  private inputMaskOptions: InputmaskOptions<T> | null = null;

  /* The original `onChange` function coming from the `setUpControl`. */
  private onChange: (value: T | null) => void = () => {
    // Placeholder for onChange callback in custom form control
  };

  private mutationObserver: MutationObserver | null = null;

  constructor(
    @Inject(PLATFORM_ID) private platformId: string,
    private elementRef: ElementRef<HTMLInputElement | any>,
    private renderer: Renderer2,
    @Optional() @Self() public ngControl: NgControl | null,
    @Inject(INPUT_MASK_CONFIG) config: InputMaskConfig,
    private ngZone: NgZone,
  ) {
    if (this.ngControl != null) {
      this.ngControl.valueAccessor = this;
    }
    this.setNativeInputElement(config);
  }

  @HostListener('input', ['$event.target.value'])
  onInput = (value: any) => {
    console.log('Input event triggered with value:', value);
  };

  @HostListener('blur', ['$event.target.value'])
  onTouched = (_: any) => {
    console.log('Blur event triggered');
  };

  ngOnDestroy(): void {
    this.removeInputMaskPlugin();
    this.mutationObserver?.disconnect();
  }

  writeValue(value: string): void {
    const formatter = this.inputMaskOptions?.formatter;
    if (value == 'Invalid date') {
      this.control.patchValue(null);
      this.control.updateValueAndValidity();
    }

    if (this.nativeInputElement) {
      this.renderer.setProperty(
        this.nativeInputElement,
        'value',
        formatter && value ? formatter(value) : (value ?? ''),
      );
    }
  }

  registerOnChange(onChange: (value: T | null) => void): void {
    this.onChange = onChange;
    const parser = this.inputMaskOptions?.parser;
    this.onInput = (value) => {
      this.onChange(parser && value ? parser(value) : value);
    };
  }

  registerOnTouched(fn: VoidFunction): void {
    this.onTouched = fn;
  }

  validate = (control: AbstractControl): ValidationErrors | null =>
    !control.value || !this.inputMaskPlugin || this.inputMaskPlugin.isValid()
      ? null
      : { inputMask: true };

  setDisabledState(disabled: boolean): void {
    if (this.nativeInputElement) {
      this.renderer.setProperty(this.nativeInputElement, 'disabled', disabled);
    }
  }

  private updateInputMask(): void {
    this.removeInputMaskPlugin();
    this.createInputMaskPlugin();
    // This re-creates the `onInput` function since `inputMaskOptions` might be changed and the `parser`
    // property now differs.
    this.registerOnChange(this.onChange);
  }

  private createInputMaskPlugin(): void {
    const { nativeInputElement, inputMaskOptions } = this;

    if (
      isPlatformServer(this.platformId) ||
      !nativeInputElement ||
      inputMaskOptions === null ||
      Object.keys(inputMaskOptions).length === 0
    ) {
      return;
    }

    const { parser, formatter, ...options } = inputMaskOptions;
    this.inputMaskPlugin = this.ngZone.runOutsideAngular(() =>
      new InputmaskConstructor(options).mask(nativeInputElement),
    );

    if (this.control) {
      setTimeout(() => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        this.control!.updateValueAndValidity();
      });
    }
  }

  private get control(): AbstractControl | any {
    return this.ngControl?.control;
  }

  private setNativeInputElement(config: InputMaskConfig) {
    if (this.elementRef.nativeElement.tagName === 'INPUT') {
      this.nativeInputElement = this.elementRef.nativeElement;
    } else {
      this.defaultInputMaskConfig = {
        ...this.defaultInputMaskConfig,
        ...config,
      };
      if (this.defaultInputMaskConfig.isAsync) {
        // Create an observer instance linked to the callback function
        this.mutationObserver = new MutationObserver((mutationsList) => {
          for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
              const nativeInputElement =
                this.elementRef.nativeElement.querySelector(
                  this.defaultInputMaskConfig.inputSelector,
                );
              if (nativeInputElement) {
                this.nativeInputElement = nativeInputElement;
                this.mutationObserver?.disconnect();
                this.createInputMaskPlugin();
              }
            }
          }
        });

        // Start observing the target node for configured mutations
        this.mutationObserver.observe(this.elementRef.nativeElement, {
          childList: true,
          subtree: true,
        });
      } else {
        this.nativeInputElement = this.elementRef.nativeElement.querySelector(
          this.defaultInputMaskConfig.inputSelector,
        );
      }
    }
  }

  private removeInputMaskPlugin(): void {
    this.inputMaskPlugin?.remove();
    this.inputMaskPlugin = null;
  }
}
