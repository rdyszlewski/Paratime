import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PomodoroStatisticsComponent } from './pomodoro-statistics.component';

describe('PomodoroStatisticsComponent', () => {
  let component: PomodoroStatisticsComponent;
  let fixture: ComponentFixture<PomodoroStatisticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PomodoroStatisticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PomodoroStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
