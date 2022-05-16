import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoLoadTodoListComponent } from './auto-load-todo-list.component';

describe('AutoLoadTodoListComponent', () => {
  let component: AutoLoadTodoListComponent;
  let fixture: ComponentFixture<AutoLoadTodoListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutoLoadTodoListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoLoadTodoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
