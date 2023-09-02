import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrowthFdAnimationComponent } from './growth-fd-animation.component';

describe('GrowthFdAnimationComponent', () => {
  let component: GrowthFdAnimationComponent;
  let fixture: ComponentFixture<GrowthFdAnimationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GrowthFdAnimationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GrowthFdAnimationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
