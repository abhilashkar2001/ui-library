import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopPerformingComponent } from './top-performing.component';

describe('TopPerformingComponent', () => {
  let component: TopPerformingComponent;
  let fixture: ComponentFixture<TopPerformingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TopPerformingComponent],
    });
    fixture = TestBed.createComponent(TopPerformingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
