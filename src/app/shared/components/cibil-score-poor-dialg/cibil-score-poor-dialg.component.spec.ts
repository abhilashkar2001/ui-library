import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CibilScorePoorDialgComponent } from './cibil-score-poor-dialg.component';

describe('CibilScorePoorDialgComponent', () => {
  let component: CibilScorePoorDialgComponent;
  let fixture: ComponentFixture<CibilScorePoorDialgComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CibilScorePoorDialgComponent]
    });
    fixture = TestBed.createComponent(CibilScorePoorDialgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
