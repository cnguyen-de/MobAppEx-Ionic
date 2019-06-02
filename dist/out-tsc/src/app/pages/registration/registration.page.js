import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../_services/auth/auth.service';
import { first } from 'rxjs/operators';
var RegistrationPage = /** @class */ (function () {
    function RegistrationPage(toastController, http, router, storage, authenticationService, formBuilder) {
        this.toastController = toastController;
        this.http = http;
        this.router = router;
        this.storage = storage;
        this.authenticationService = authenticationService;
        this.formBuilder = formBuilder;
        this.buttonPressed = false;
    }
    RegistrationPage.prototype.ngOnInit = function () {
        this.registrationForm = this.formBuilder.group({
            username: ['', Validators.required],
            email: ['', Validators.required],
            password: ['', [Validators.required, Validators.minLength(6)]],
            repeatPassword: ['', [Validators.required, Validators.minLength(6)]]
        }, {
            validator: this.checkPasswords('password', 'repeatPassword')
        });
    };
    RegistrationPage.prototype.checkPasswords = function (controlName, matchingControlName) {
        return function (formGroup) {
            var control = formGroup.controls[controlName];
            var matchingControl = formGroup.controls[matchingControlName];
            if (matchingControl.errors && !matchingControl.errors.mustMatch) {
                // return if another validator has already found an error on the matchingControl
                return;
            }
            // set error on matchingControl if validation fails
            if (control.value !== matchingControl.value) {
                matchingControl.setErrors({ mustMatch: true });
            }
            else {
                matchingControl.setErrors(null);
            }
        };
    };
    RegistrationPage.prototype.onSubmit = function () {
        var _this = this;
        if (this.registrationForm.invalid) {
            return;
        }
        this.buttonPressed = !this.buttonPressed;
        this.authenticationService.register(this.registrationForm.value.username, this.registrationForm.value.email, this.registrationForm.value.password)
            .pipe(first())
            .subscribe(function (data) {
            _this.toast('Successfully registered');
            _this.router.navigateByUrl('/login');
            _this.buttonPressed = !_this.buttonPressed;
        }, function (error) {
            _this.buttonPressed = !_this.buttonPressed;
            console.log(error);
            if (error.status === 0 || error.status === 504) {
                _this.toast("Unable to communicate with server");
            }
            else if (error) {
                _this.toast(error);
            }
        });
    };
    RegistrationPage.prototype.toast = function (message) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var toast;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.toastController.create({
                            message: message,
                            duration: 3000,
                            position: 'top',
                            cssClass: 'toast-container',
                            keyboardClose: true
                        })];
                    case 1:
                        toast = _a.sent();
                        toast.present();
                        return [2 /*return*/];
                }
            });
        });
    };
    RegistrationPage = tslib_1.__decorate([
        Component({
            selector: 'app-registration',
            templateUrl: './registration.page.html',
            styleUrls: ['./registration.page.scss'],
        }),
        tslib_1.__metadata("design:paramtypes", [ToastController, HttpClient,
            Router, Storage,
            AuthService, FormBuilder])
    ], RegistrationPage);
    return RegistrationPage;
}());
export { RegistrationPage };
//# sourceMappingURL=registration.page.js.map