import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LanguageChooserModalPage } from './language-chooser-modal.page';

describe('LanguageChooserModalPage', () => {
  let component: LanguageChooserModalPage;
  let fixture: ComponentFixture<LanguageChooserModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LanguageChooserModalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LanguageChooserModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
