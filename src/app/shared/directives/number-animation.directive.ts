import {
  Directive,
  ElementRef,
  Input,
  OnChanges,
  Renderer2,
  SimpleChanges,
} from '@angular/core';

@Directive({
  selector: '[appNumberAnimation]',
})
export class NumberAnimationDirective implements OnChanges {
  @Input() appNumberAnimation: any = 0;

  private animationFrame: number | null = null;
  private originalFormat: string | null = null;
  private originalNumberText: string | null = null;
  private audio = new Audio();
  private lastPlayedTime = 0;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
  ) {
    this.audio.src = 'assets/sound/coin-falling.wav';
    this.audio.load();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['appNumberAnimation']) {
      const newValue = this.extractNumber(this.appNumberAnimation);
      const currentText = this.el.nativeElement.textContent;
      const oldValue = this.extractNumber(currentText);

      // Capture and store original string and number once
      if (!this.originalFormat && currentText.trim()) {
        this.originalFormat = currentText;
        const numberMatch = currentText.match(/-?\d[\d,]*(\.\d+)?/);
        this.originalNumberText = numberMatch ? numberMatch[0] : null;
      }

      if (newValue !== null && oldValue !== newValue) {
        this.animateValue(oldValue, newValue, 1000);
      }
    }
  }

  private extractNumber(value: any): number | null {
    if (value === null || value === undefined) return null;
    const match = value.toString().match(/-?\d[\d,]*(\.\d+)?/);
    if (match) {
      const cleaned = match[0].replace(/,/g, ''); // Remove commas for parsing
      return parseFloat(cleaned);
    }
    return null;
  }

  private animateValue(start: number | null, end: number, duration: number) {
    if (start === null) start = 0;
    if (this.animationFrame) cancelAnimationFrame(this.animationFrame);

    let current = start;
    const step = (end - start) / (duration / 16); // 60 FPS

    const updateValue = () => {
      current += step;
      if ((step > 0 && current >= end) || (step < 0 && current <= end)) {
        current = end;
      }

      if (this.originalFormat && this.originalNumberText) {
        const updatedText = this.originalFormat.replace(
          this.originalNumberText,
          this.formatNumber(current, this.originalNumberText),
        );
        this.renderer.setProperty(
          this.el.nativeElement,
          'textContent',
          updatedText,
        );
      }

      if (Date.now() - this.lastPlayedTime > 150) {
        this.lastPlayedTime = Date.now();
        this.audio.currentTime = 0;
        this.audio.play().catch(() => {});
      }

      if (current !== end) {
        this.animationFrame = requestAnimationFrame(updateValue);
      }
    };

    this.animationFrame = requestAnimationFrame(updateValue);
  }

  private formatNumber(value: number, original: string): string {
    const decimalPlaces = original.includes('.')
      ? original.split('.')[1]?.length
      : 0;

    // Retain the comma format only if present in the original
    const formatted = value.toLocaleString('en-IN', {
      minimumFractionDigits: decimalPlaces,
      maximumFractionDigits: decimalPlaces,
    });

    return formatted;
  }
}
