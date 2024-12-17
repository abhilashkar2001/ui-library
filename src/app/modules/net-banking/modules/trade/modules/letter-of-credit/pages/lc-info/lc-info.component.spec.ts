import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LcInfoComponent } from './lc-info.component';

describe('LcInfoComponent', () => {
  let component: LcInfoComponent;
  let fixture: ComponentFixture<LcInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LcInfoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LcInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
