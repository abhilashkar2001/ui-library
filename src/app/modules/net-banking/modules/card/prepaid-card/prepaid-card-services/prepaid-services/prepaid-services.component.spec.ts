import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrepaidServicesComponent } from './prepaid-services.component';

describe('PrepaidServicesComponent', () => {
  let component: PrepaidServicesComponent;
  let fixture: ComponentFixture<PrepaidServicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrepaidServicesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrepaidServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
