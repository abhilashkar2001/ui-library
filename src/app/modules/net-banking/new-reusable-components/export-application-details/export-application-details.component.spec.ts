import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportApplicationDetailsComponent } from './export-application-details.component';

describe('ExportApplicationDetailsComponent', () => {
  let component: ExportApplicationDetailsComponent;
  let fixture: ComponentFixture<ExportApplicationDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExportApplicationDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExportApplicationDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
