import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiService } from './api/api.service';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
var ErrorInterceptor = /** @class */ (function () {
    function ErrorInterceptor(apiService, router, storage) {
        this.apiService = apiService;
        this.router = router;
        this.storage = storage;
    }
    ErrorInterceptor.prototype.intercept = function (request, next) {
        var _this = this;
        return next.handle(request).pipe(catchError(function (err) {
            if (err.status === 401) {
                // auto logout if 401 response returned from api
                _this.apiService.logOutLocally();
                _this.router.navigateByUrl('/login');
            }
            var error = err.error.message || err.statusText;
            return throwError(error);
        }));
    };
    ErrorInterceptor = tslib_1.__decorate([
        Injectable(),
        tslib_1.__metadata("design:paramtypes", [ApiService, Router, Storage])
    ], ErrorInterceptor);
    return ErrorInterceptor;
}());
export { ErrorInterceptor };
//# sourceMappingURL=error-interceptor.js.map