import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommmonSteeperComponent } from './commmon-steeper.component';

describe('CommmonSteeperComponent', () => {
  let component: CommmonSteeperComponent;
  let fixture: ComponentFixture<CommmonSteeperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CommmonSteeperComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CommmonSteeperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
