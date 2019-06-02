import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
var TabsGuard = /** @class */ (function () {
    function TabsGuard(storage, router) {
        this.storage = storage;
        this.router = router;
    }
    TabsGuard.prototype.canActivate = function (next, state) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var token;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.storage.get('access_token')];
                    case 1:
                        token = _a.sent();
                        if (!(typeof token == 'string')) {
                            this.router.navigateByUrl('/login');
                            return [2 /*return*/, false];
                        }
                        else {
                            return [2 /*return*/, true];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    TabsGuard = tslib_1.__decorate([
        Injectable({
            providedIn: 'root'
        }),
        tslib_1.__metadata("design:paramtypes", [Storage, Router])
    ], TabsGuard);
    return TabsGuard;
}());
export { TabsGuard };
//# sourceMappingURL=tabs.guard.js.map