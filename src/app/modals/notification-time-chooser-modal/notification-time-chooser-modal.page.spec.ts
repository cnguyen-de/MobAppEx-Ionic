import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationTimeChooserModalPage } from './notification-time-chooser-modal.page';

describe('NotificationTimeChooserModalPage', () => {
  let component: NotificationTimeChooserModalPage;
  let fixture: ComponentFixture<NotificationTimeChooserModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificationTimeChooserModalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationTimeChooserModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
