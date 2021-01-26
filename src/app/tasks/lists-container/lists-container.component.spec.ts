import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListsContainerComponent } from './lists-container.component';

describe('ListsContainerComponent', () => {
  let component: ListsContainerComponent;
  let fixture: ComponentFixture<ListsContainerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListsContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListsContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
