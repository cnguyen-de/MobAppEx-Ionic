import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { map } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { BehaviorSubject } from 'rxjs';
var ApiService = /** @class */ (function () {
    function ApiService(httpClient, storage, authService) {
        var _this = this;
        this.httpClient = httpClient;
        this.storage = storage;
        this.authService = authService;
        // @ts-ignore
        this.currentUserSubject = new BehaviorSubject(this.getUser());
        this.currentUser = this.currentUserSubject.asObservable();
        this.storage.get('server').then(function (serverIP) {
            _this.server = serverIP;
        });
        // this.storage.get('user').then((user) => {
        //   this.currentUser = user;
        // });
        this.storage.get('access_token').then(function (token) {
            if (typeof token == 'string') {
                _this.token = token;
            }
        });
    }
    //API METHODS
    ApiService.prototype.changePassword = function (oldPassword, newPassword) {
        var params = this.setParamToken(this.token);
        return this.httpClient.post(this.server + "/SnoozeUsers/change-password", { oldPassword: oldPassword, newPassword: newPassword }, { params: params }).pipe(map(function (res) {
            return res;
        }));
    };
    ApiService.prototype.recoverPassword = function (email) {
        // let params = this.setParamToken(this.token);
        return this.httpClient.post(this.server + "/SnoozeUsers/reset", { email: email }).pipe(map(function (res) {
            return res;
        }));
    };
    ApiService.prototype.getUser = function (token) {
        var _this = this;
        this.token = token;
        var params = this.setParamToken(token);
        return this.httpClient.get(this.server + "/SnoozeUsers/GetUserData", { params: params }).pipe(map(function (res) {
            _this.saveToStorage('user', res);
            // @ts-ignore
            _this.currentUserSubject.next(res);
            return res;
        }));
    };
    ApiService.prototype.logOut = function () {
        this.getToken();
        var params = this.setParamToken(this.token);
        return this.httpClient.post(this.server + "/SnoozeUsers/logout", {}, { params: params }).pipe(map(function (res) {
            return res;
        }));
    };
    ApiService.prototype.logOutLocally = function () {
        this.storage.remove('user');
        this.storage.remove('access_token');
        return true;
    };
    ApiService.prototype.getCapsules = function () {
        this.getToken();
        var params = this.setParamToken(this.token);
        return this.httpClient.post(this.server + "/Capsules", {}, { params: params }).pipe(map(function (res) {
            return res;
        }));
    };
    ApiService.prototype.getCapsuleById = function (id) {
        this.getToken();
        var params = this.setParamToken(this.token);
        return this.httpClient.post(this.server + "/Capsules/" + id, {}, { params: params }).pipe(map(function (res) {
            return res;
        }));
    };
    ApiService.prototype.bookCapsule = function (Capsule_id, Pin, Date, FirstTimeFrame, LastTimeFrame, Vendor, Amount, IsVerified, PayerEmail, PayedAmount, PayedDate) {
        var SnoozeUser_id;
        this.currentUser.subscribe(function (data) {
            SnoozeUser_id = data.id;
        });
        var params = this.setParamToken(this.token);
        return this.httpClient.post(this.server + "/Bookings/", { SnoozeUser_id: SnoozeUser_id, Capsule_id: Capsule_id, Pin: Pin, Date: Date, FirstTimeFrame: FirstTimeFrame, LastTimeFrame: LastTimeFrame, Vendor: Vendor, Amount: Amount, IsVerified: IsVerified, PayerEmail: PayerEmail, PayedAmount: PayedAmount, PayedDate: PayedDate }, { params: params }).pipe(map(function (res) {
            return res;
        }));
    };
    ApiService.prototype.getBookings = function () {
        var id;
        this.currentUser.subscribe(function (data) {
            id = data.id;
        });
        this.getToken();
        this.token = "KwyrCfYFxf8sItVTo6fx98FDKVySMFewmbPfI0ISKA6JLCgCPhHXh4XDZsv4o52C";
        var params = this.setParamToken(this.token);
        return this.httpClient.get(this.server + "/SnoozeUsers/" + id + "/bookings", { params: params }).pipe(map(function (res) {
            return res;
        }));
    };
    //HELPER METHODS
    ApiService.prototype.setParamToken = function (token) {
        var params = new HttpParams();
        params = params.append('access_token', token);
        return params;
    };
    ApiService.prototype.getCurrentUser = function () {
        return this.storage.get('user').then(function (user) {
            return user;
        });
    };
    Object.defineProperty(ApiService.prototype, "currentUserValue", {
        get: function () {
            return this.currentUserSubject.value;
        },
        enumerable: true,
        configurable: true
    });
    ApiService.prototype.getToken = function () {
        var _this = this;
        return this.storage.get('access_token').then(function (token) {
            _this.token = token;
            return token;
        });
    };
    ApiService.prototype.saveToStorage = function (key, value) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.storage.set(key, value)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ApiService = tslib_1.__decorate([
        Injectable({
            providedIn: 'root'
        }),
        tslib_1.__metadata("design:paramtypes", [HttpClient, Storage, AuthService])
    ], ApiService);
    return ApiService;
}());
export { ApiService };
//# sourceMappingURL=api.service.js.map