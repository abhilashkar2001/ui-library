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
  @Input('inViewAnimate') animationClass!: string;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
  ) {}

  ngAfterViewInit() {
    this.renderer.addClass(this.el.nativeElement, 'in-view-animate-init');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.renderer.addClass(this.el.nativeElement, this.animationClass);
            this.renderer.removeClass(
              this.el.nativeElement,
              'in-view-animate-init',
            );
            observer.unobserve(this.el.nativeElement);
          }
        });
      },
      { threshold: 0.1 },
    );
    observer.observe(this.el.nativeElement);
  }
}
