import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordChangerModalPage } from './password-changer-modal.page';

describe('PasswordChangerModalPage', () => {
  let component: PasswordChangerModalPage;
  let fixture: ComponentFixture<PasswordChangerModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PasswordChangerModalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordChangerModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
