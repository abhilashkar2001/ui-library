import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetStatementPopupComponent } from './get-statement-popup.component';

describe('GetStatementPopupComponent', () => {
  let component: GetStatementPopupComponent;
  let fixture: ComponentFixture<GetStatementPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GetStatementPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GetStatementPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
