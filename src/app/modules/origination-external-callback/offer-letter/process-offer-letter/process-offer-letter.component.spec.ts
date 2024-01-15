import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessOfferLetterComponent } from './process-offer-letter.component';

describe('ProcessOfferLetterComponent', () => {
  let component: ProcessOfferLetterComponent;
  let fixture: ComponentFixture<ProcessOfferLetterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProcessOfferLetterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProcessOfferLetterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
