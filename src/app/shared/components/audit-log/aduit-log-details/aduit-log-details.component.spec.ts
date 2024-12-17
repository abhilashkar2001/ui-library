import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AduitLogDetailsComponent } from './aduit-log-details.component';

describe('AduitLogDetailsComponent', () => {
  let component: AduitLogDetailsComponent;
  let fixture: ComponentFixture<AduitLogDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AduitLogDetailsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AduitLogDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
