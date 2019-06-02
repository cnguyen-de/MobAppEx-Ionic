import { TestBed } from '@angular/core/testing';
import { LocationService } from './location.service';
describe('LocationService', function () {
    beforeEach(function () { return TestBed.configureTestingModule({}); });
    it('should be created', function () {
        var service = TestBed.get(LocationService);
        expect(service).toBeTruthy();
    });
});
//# sourceMappingURL=location.service.spec.js.map