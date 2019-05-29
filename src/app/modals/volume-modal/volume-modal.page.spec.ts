import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VolumeModalPage } from './volume-modal.page';

describe('VolumeModalPage', () => {
  let component: VolumeModalPage;
  let fixture: ComponentFixture<VolumeModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VolumeModalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VolumeModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
