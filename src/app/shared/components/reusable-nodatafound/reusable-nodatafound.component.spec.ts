import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReusableNodatafoundComponent } from './reusable-nodatafound.component';

describe('ReusableNodatafoundComponent', () => {
  let component: ReusableNodatafoundComponent;
  let fixture: ComponentFixture<ReusableNodatafoundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReusableNodatafoundComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ReusableNodatafoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
