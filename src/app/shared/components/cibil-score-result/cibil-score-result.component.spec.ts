import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CibilScoreComponent } from './cibil-score-result.component';

describe('CibilScoreComponent', () => {
  let component: CibilScoreComponent;
  let fixture: ComponentFixture<CibilScoreComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CibilScoreComponent]
    });
    fixture = TestBed.createComponent(CibilScoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
