import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LcOtherConditionsComponent } from './lc-other-conditions.component';

describe('LcOtherConditionsComponent', () => {
  let component: LcOtherConditionsComponent;
  let fixture: ComponentFixture<LcOtherConditionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LcOtherConditionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LcOtherConditionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
