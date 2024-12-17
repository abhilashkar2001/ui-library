import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonLevelStatusComponent } from './common-level-status.component';

describe('CommonLevelStatusComponent', () => {
  let component: CommonLevelStatusComponent;
  let fixture: ComponentFixture<CommonLevelStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CommonLevelStatusComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CommonLevelStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
