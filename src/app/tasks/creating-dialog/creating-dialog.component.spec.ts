import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CreatingDialogComponent } from './creating-dialog.component';

describe('CreatingDialogComponent', () => {
  let component: CreatingDialogComponent;
  let fixture: ComponentFixture<CreatingDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatingDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatingDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
