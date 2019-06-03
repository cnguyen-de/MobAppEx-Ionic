import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThisAppPage } from './this-app.page';

describe('ThisAppPage', () => {
  let component: ThisAppPage;
  let fixture: ComponentFixture<ThisAppPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThisAppPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThisAppPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
