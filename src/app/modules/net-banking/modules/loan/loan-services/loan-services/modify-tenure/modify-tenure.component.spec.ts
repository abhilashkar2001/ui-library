import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyTenureComponent } from './modify-tenure.component';

describe('ModifyTenureComponent', () => {
  let component: ModifyTenureComponent;
  let fixture: ComponentFixture<ModifyTenureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModifyTenureComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModifyTenureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
