import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplyAccountComponent } from './apply-account.component';

describe('ApplyAccountComponent', () => {
  let component: ApplyAccountComponent;
  let fixture: ComponentFixture<ApplyAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ApplyAccountComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ApplyAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
