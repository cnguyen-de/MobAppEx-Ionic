import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CapsuleControlPage } from './capsule-control.page';

describe('CapsuleControlPage', () => {
  let component: CapsuleControlPage;
  let fixture: ComponentFixture<CapsuleControlPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CapsuleControlPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CapsuleControlPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
