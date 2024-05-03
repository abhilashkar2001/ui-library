import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportLcDetailsComponent } from './export-lc-details.component';

describe('ExportLcDetailsComponent', () => {
  let component: ExportLcDetailsComponent;
  let fixture: ComponentFixture<ExportLcDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExportLcDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExportLcDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
