import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportProcessInfoComponent } from './export-process-info.component';

describe('ExportProcessInfoComponent', () => {
  let component: ExportProcessInfoComponent;
  let fixture: ComponentFixture<ExportProcessInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExportProcessInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExportProcessInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
