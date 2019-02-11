import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllMapComponent } from './all-map.component';

describe('AllMapComponent', () => {
  let component: AllMapComponent;
  let fixture: ComponentFixture<AllMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AllMapComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
