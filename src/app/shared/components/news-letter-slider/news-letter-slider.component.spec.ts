import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsLetterSliderComponent } from './news-letter-slider.component';

describe('NewsLetterSliderComponent', () => {
  let component: NewsLetterSliderComponent;
  let fixture: ComponentFixture<NewsLetterSliderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewsLetterSliderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NewsLetterSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
