import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CibilScoreContainerComponent } from './cibil-score-container.component';

describe('CibilScoreContainerComponent', () => {
  let component: CibilScoreContainerComponent;
  let fixture: ComponentFixture<CibilScoreContainerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CibilScoreContainerComponent],
    });
    fixture = TestBed.createComponent(CibilScoreContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
