import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewAuditlogButtonGroupComponent } from './new-auditlog-button-group.component';

describe('NewAuditlogButtonGroupComponent', () => {
  let component: NewAuditlogButtonGroupComponent;
  let fixture: ComponentFixture<NewAuditlogButtonGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewAuditlogButtonGroupComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NewAuditlogButtonGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
