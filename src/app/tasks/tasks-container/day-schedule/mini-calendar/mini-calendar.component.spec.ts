import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MiniCalendarComponent } from './mini-calendar.component';

describe('MiniCalendarComponent', () => {
  let component: MiniCalendarComponent;
  let fixture: ComponentFixture<MiniCalendarComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MiniCalendarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MiniCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
