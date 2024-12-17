import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectSingleTransferComponent } from './select-single-transfer.component';

describe('SelectSingleTransferComponent', () => {
  let component: SelectSingleTransferComponent;
  let fixture: ComponentFixture<SelectSingleTransferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SelectSingleTransferComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectSingleTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
