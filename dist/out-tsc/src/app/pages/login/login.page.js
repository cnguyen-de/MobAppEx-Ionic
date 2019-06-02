import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../_services/auth/auth.service';
import { first } from 'rxjs/operators';
import { ApiService } from '../../_services/api/api.service';
var LoginPage = /** @class */ (function () {
    function LoginPage(toastController, http, router, storage, authenticationService, formBuilder, apiService) {
        this.toastController = toastController;
        this.http = http;
        this.router = router;
        this.storage = storage;
        this.authenticationService = authenticationService;
        this.formBuilder = formBuilder;
        this.apiService = apiService;
        this.loginPressed = false;
    }
    LoginPage.prototype.ngOnInit = function () {
        this.loginForm = this.formBuilder.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });
    };
    LoginPage.prototype.onSubmit = function () {
        var _this = this;
        if (this.loginForm.invalid) {
            return;
        }
        this.loginPressed = !this.loginPressed;
        this.authenticationService.login(this.loginForm.value.username, this.loginForm.value.password)
            .pipe(first())
            .subscribe(function (data) {
            _this.router.navigateByUrl('/tabs/tab1');
            _this.loginPressed = !_this.loginPressed;
            // @ts-ignore
            _this.apiService.getUser(data.id.toString())
                .pipe(first())
                .subscribe(function (data) {
                console.log(data);
            }, function (error) {
                console.log(error);
            });
        }, function (error) {
            _this.loginPressed = !_this.loginPressed;
            _this.loginForm.setValue({ username: _this.loginForm.value.username, password: '' });
            console.log(error);
            if (error.status === 0 || error.status === 504) {
                _this.toast("Unable to communicate with server");
            }
            else {
                _this.toast(error);
            }
        });
    };
    LoginPage.prototype.saveToStorage = function (key, value) {
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
    LoginPage.prototype.toast = function (message) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var toast;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.toastController.create({
                            message: message,
                            duration: 3000,
                            position: 'top',
                            cssClass: 'toast-container',
                            keyboardClose: true,
                        })];
                    case 1:
                        toast = _a.sent();
                        toast.present();
                        return [2 /*return*/];
                }
            });
        });
    };
    LoginPage = tslib_1.__decorate([
        Component({
            selector: 'app-login',
            templateUrl: './login.page.html',
            styleUrls: ['./login.page.scss'],
        }),
        tslib_1.__metadata("design:paramtypes", [ToastController, HttpClient,
            Router, Storage,
            AuthService, FormBuilder,
            ApiService])
    ], LoginPage);
    return LoginPage;
}());
export { LoginPage };
//# sourceMappingURL=login.page.js.map