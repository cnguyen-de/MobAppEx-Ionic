import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { Storage } from '@ionic/storage';
var AuthService = /** @class */ (function () {
    function AuthService(httpClient, storage) {
        var _this = this;
        this.httpClient = httpClient;
        this.storage = storage;
        this.server = this.storage.get('server').then(function (serverIP) {
            _this.server = serverIP;
        });
        // @ts-ignore
        this.currentUserSubject = new BehaviorSubject(this.getUser());
        this.currentUser = this.currentUserSubject.asObservable();
    }
    AuthService.prototype.getUser = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.storage.get('user')];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Object.defineProperty(AuthService.prototype, "currentUserValue", {
        get: function () {
            return this.currentUserSubject.value;
        },
        enumerable: true,
        configurable: true
    });
    AuthService.prototype.register = function (username, email, password) {
        var _this = this;
        return this.httpClient.post(this.server + "/SnoozeUsers", { username: username, email: email, password: password }).pipe(map(function (res) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                console.log(res);
                return [2 /*return*/, res];
            });
        }); }));
    };
    AuthService.prototype.login = function (username, password) {
        var _this = this;
        return this.httpClient.post(this.server + "/SnoozeUsers/login", { username: username, password: password }).pipe(map(function (res) {
            console.log(res);
            // @ts-ignore
            _this.saveToStorage('access_token', res.id);
            return res;
        }));
    };
    AuthService.prototype.saveToStorage = function (key, value) {
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
    AuthService = tslib_1.__decorate([
        Injectable({
            providedIn: 'root'
        }),
        tslib_1.__metadata("design:paramtypes", [HttpClient, Storage])
    ], AuthService);
    return AuthService;
}());
export { AuthService };
//# sourceMappingURL=auth.service.js.map