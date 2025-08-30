import {
  Directive,
  ElementRef,
  Input,
  Renderer2,
  AfterViewInit,
} from '@angular/core';

@Directive({
  selector: '[inViewAnimate]',
})
export class InViewAnimateDirective implements AfterViewInit {
  /** CSS animation class (e.g. 'fade-up', 'zoom-in') */
  @Input('inViewAnimate') animationClass!: string;

  /** Optional delay: e.g. '0.2s', '200ms' */
  @Input() delay: string = '0s';

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
  ) {}

  ngAfterViewInit() {
    this.renderer.addClass(this.el.nativeElement, 'in-view-animate-init');

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Applying delay if set
            if (this.delay) {
              this.renderer.setStyle(
                this.el.nativeElement,
                'animation-delay',
                this.delay
              );
            }

            // Triggering animation
            this.renderer.addClass(this.el.nativeElement, this.animationClass);
            this.renderer.removeClass(
              this.el.nativeElement,
              'in-view-animate-init'
            );

            // Animating only once
            obs.unobserve(this.el.nativeElement);
          }
        });
      },
      { threshold: 0.15 } // revealing when 15% visible
    );

    observer.observe(this.el.nativeElement);
  }
}
