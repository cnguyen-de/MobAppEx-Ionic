import { TestBed, inject } from '@angular/core/testing';
import { SlidesGuard } from './slides.guard';
describe('SlidesGuard', function () {
    beforeEach(function () {
        TestBed.configureTestingModule({
            providers: [SlidesGuard]
        });
    });
    it('should ...', inject([SlidesGuard], function (guard) {
        expect(guard).toBeTruthy();
    }));
});
//# sourceMappingURL=slides.guard.spec.js.map