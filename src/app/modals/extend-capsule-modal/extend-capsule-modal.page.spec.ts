import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtendCapsuleModalPage } from './extend-capsule-modal.page';

describe('ExtendCapsuleModalPage', () => {
  let component: ExtendCapsuleModalPage;
  let fixture: ComponentFixture<ExtendCapsuleModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExtendCapsuleModalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtendCapsuleModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
