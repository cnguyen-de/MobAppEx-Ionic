import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
var SlidesGuard = /** @class */ (function () {
    function SlidesGuard(storage, router) {
        this.storage = storage;
        this.router = router;
    }
    SlidesGuard.prototype.canActivate = function (next, state) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var isComplete;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.getAccessToken();
                        return [4 /*yield*/, this.storage.get('slidesDone')];
                    case 1:
                        isComplete = _a.sent();
                        if (!isComplete) {
                            this.router.navigateByUrl('/slides');
                        }
                        else if (this.token != null) {
                            this.router.navigateByUrl('/tabs/tab1');
                        }
                        return [2 /*return*/, isComplete];
                }
            });
        });
    };
    SlidesGuard.prototype.getAccessToken = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, this.storage.get('access_token')];
                    case 1:
                        _a.token = _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SlidesGuard = tslib_1.__decorate([
        Injectable({
            providedIn: 'root'
        }),
        tslib_1.__metadata("design:paramtypes", [Storage, Router])
    ], SlidesGuard);
    return SlidesGuard;
}());
export { SlidesGuard };
//# sourceMappingURL=slides.guard.js.map