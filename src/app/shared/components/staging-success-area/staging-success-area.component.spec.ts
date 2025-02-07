import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StagingSuccessAreaComponent } from './staging-success-area.component';

describe('StagingSuccessAreaComponent', () => {
  let component: StagingSuccessAreaComponent;
  let fixture: ComponentFixture<StagingSuccessAreaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StagingSuccessAreaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StagingSuccessAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
