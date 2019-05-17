import { TestBed, async, inject } from '@angular/core/testing';

import { SlidesGuard } from './slides.guard';

describe('SlidesGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SlidesGuard]
    });
  });

  it('should ...', inject([SlidesGuard], (guard: SlidesGuard) => {
    expect(guard).toBeTruthy();
  }));
});
