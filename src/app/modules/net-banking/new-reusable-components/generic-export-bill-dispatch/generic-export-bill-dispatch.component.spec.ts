import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericExportBillDispatchComponent } from './generic-export-bill-dispatch.component';

describe('GenericExportBillDispatchComponent', () => {
  let component: GenericExportBillDispatchComponent;
  let fixture: ComponentFixture<GenericExportBillDispatchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenericExportBillDispatchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenericExportBillDispatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
