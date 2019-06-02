import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
var TokenInterceptor = /** @class */ (function () {
    function TokenInterceptor(storage) {
        this.storage = storage;
    }
    TokenInterceptor.prototype.intercept = function (request, next) {
        var _this = this;
        /*
        let currentUser = this.authenticationService.currentUserValue;
        if (currentUser && currentUser.token) {
          request = request.clone({
            setHeaders: {
              Authorization: `Bearer ${currentUser.token}`
            }
          });
        }
        */
        this.setSessId().then(function (done) {
            request = request.clone({
                setParams: {
                    access_token: _this.token
                },
                withCredentials: true,
            });
        });
        return next.handle(request);
    };
    TokenInterceptor.prototype.setSessId = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, this.storage.get('access_token')];
                    case 1:
                        _a.token = _b.sent();
                        return [2 /*return*/, true];
                }
            });
        });
    };
    TokenInterceptor = tslib_1.__decorate([
        Injectable(),
        tslib_1.__metadata("design:paramtypes", [Storage])
    ], TokenInterceptor);
    return TokenInterceptor;
}());
export { TokenInterceptor };
//# sourceMappingURL=token-interceptor.js.map