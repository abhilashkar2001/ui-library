import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StopChequeComponent } from './stop-cheque.component';

describe('StopChequeComponent', () => {
  let component: StopChequeComponent;
  let fixture: ComponentFixture<StopChequeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StopChequeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StopChequeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
