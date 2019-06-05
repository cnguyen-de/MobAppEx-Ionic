import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LicensesPage } from './licenses.page';

describe('LicensesPage', () => {
  let component: LicensesPage;
  let fixture: ComponentFixture<LicensesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LicensesPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LicensesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
