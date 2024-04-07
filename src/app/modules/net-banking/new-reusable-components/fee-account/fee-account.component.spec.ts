import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeeAccountComponent } from './fee-account.component';

describe('FeeAccountComponent', () => {
  let component: FeeAccountComponent;
  let fixture: ComponentFixture<FeeAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FeeAccountComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeeAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
