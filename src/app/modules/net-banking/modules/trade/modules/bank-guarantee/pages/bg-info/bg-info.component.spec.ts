import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BgInfoComponent } from './bg-info.component';

describe('BgInfoComponent', () => {
  let component: BgInfoComponent;
  let fixture: ComponentFixture<BgInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BgInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BgInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
