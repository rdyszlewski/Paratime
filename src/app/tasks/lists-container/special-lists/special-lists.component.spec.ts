import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SpecialListsComponent } from './special-lists.component';

describe('SpecialListsComponent', () => {
  let component: SpecialListsComponent;
  let fixture: ComponentFixture<SpecialListsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SpecialListsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecialListsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
