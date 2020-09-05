import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialListsComponent } from './special-lists.component';

describe('SpecialListsComponent', () => {
  let component: SpecialListsComponent;
  let fixture: ComponentFixture<SpecialListsComponent>;

  beforeEach(async(() => {
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
