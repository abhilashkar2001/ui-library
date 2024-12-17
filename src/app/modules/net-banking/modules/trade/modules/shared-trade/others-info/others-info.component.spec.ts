import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OthersInfoComponent } from './others-info.component';

describe('OthersInfoComponent', () => {
  let component: OthersInfoComponent;
  let fixture: ComponentFixture<OthersInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OthersInfoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OthersInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
