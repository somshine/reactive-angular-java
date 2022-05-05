import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllRequestMethodComponent } from './all-request-method.component';

describe('AllRequestMethodComponent', () => {
  let component: AllRequestMethodComponent;
  let fixture: ComponentFixture<AllRequestMethodComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllRequestMethodComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllRequestMethodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
