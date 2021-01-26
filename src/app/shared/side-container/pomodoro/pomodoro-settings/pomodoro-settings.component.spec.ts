import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PomodoroSettingsComponent } from './pomodoro-settings.component';

describe('PomodoroSettingsComponent', () => {
  let component: PomodoroSettingsComponent;
  let fixture: ComponentFixture<PomodoroSettingsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PomodoroSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PomodoroSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
