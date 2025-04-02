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
  @Input() appNumberAnimation: any = 0; // Accepts numbers with formatting

  private animationFrame: number | null = null;
  private originalFormat: string | null = null; // Stores the original text format
  private audio = new Audio(); // Preload audio
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
      const oldValue = this.extractNumber(this.el.nativeElement.textContent);

      // Store the original format only if it's not stored yet
      if (!this.originalFormat && this.el.nativeElement.textContent.trim()) {
        this.originalFormat = this.el.nativeElement.textContent;
      }

      if (newValue !== null && oldValue !== newValue) {
        this.animateValue(oldValue, newValue, 1000);
      }
    }
  }

  private extractNumber(value: any): number | null {
    if (value === null || value === undefined) return null;
    const match = value.toString().match(/-?\d+(\.\d+)?/);
    return match ? parseFloat(match[0]) : null;
  }

  private animateValue(start: number | null, end: number, duration: number) {
    if (start === null) start = 0; // Default start value if null

    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }

    let current = start;
    const step = (end - start) / (duration / 16); // 60 FPS smooth animation

    const updateValue = () => {
      current += step;
      if ((step > 0 && current >= end) || (step < 0 && current <= end)) {
        current = end;
      }

      // Ensure original format is restored with updated number
      if (this.originalFormat) {
        const updatedText = this.originalFormat.replace(
          /-?\d+(\.\d+)?/,
          current.toFixed(2),
        );
        this.renderer.setProperty(
          this.el.nativeElement,
          'textContent',
          updatedText,
        );
      }
      // Play sound at controlled intervals (every 150ms)
      if (Date.now() - this.lastPlayedTime > 150) {
        this.lastPlayedTime = Date.now();
        this.audio.currentTime = 0; // Restart sound
        this.audio.play().catch(() => {}); // Catch prevents potential errors on first load
      }

      if (current !== end) {
        this.animationFrame = requestAnimationFrame(updateValue);
      }
    };

    this.animationFrame = requestAnimationFrame(updateValue);
  }
}
