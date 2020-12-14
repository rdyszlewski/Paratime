import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InsertingTemplateComponent } from './inserting-template.component';

describe('InsertingTemplateComponent', () => {
  let component: InsertingTemplateComponent;
  let fixture: ComponentFixture<InsertingTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InsertingTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InsertingTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
