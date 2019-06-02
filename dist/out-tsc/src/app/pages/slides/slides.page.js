import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
var SlidesPage = /** @class */ (function () {
    function SlidesPage(storage, router) {
        this.storage = storage;
        this.router = router;
        this.slideOpts = {
            initialSlide: 0,
            speed: 400
        };
    }
    SlidesPage.prototype.ngOnInit = function () {
    };
    SlidesPage.prototype.finish = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.storage.set('slidesDone', true)];
                    case 1:
                        _a.sent();
                        this.router.navigateByUrl('/');
                        return [2 /*return*/];
                }
            });
        });
    };
    SlidesPage = tslib_1.__decorate([
        Component({
            selector: 'app-slides',
            templateUrl: './slides.page.html',
            styleUrls: ['./slides.page.scss'],
        }),
        tslib_1.__metadata("design:paramtypes", [Storage, Router])
    ], SlidesPage);
    return SlidesPage;
}());
export { SlidesPage };
//# sourceMappingURL=slides.page.js.map