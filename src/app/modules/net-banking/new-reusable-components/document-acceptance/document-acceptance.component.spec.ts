import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentAcceptanceComponent } from './document-acceptance.component';

describe('DocumentAcceptanceComponent', () => {
  let component: DocumentAcceptanceComponent;
  let fixture: ComponentFixture<DocumentAcceptanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentAcceptanceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocumentAcceptanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
