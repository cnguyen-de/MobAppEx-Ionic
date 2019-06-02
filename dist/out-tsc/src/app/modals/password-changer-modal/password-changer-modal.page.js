import * as tslib_1 from "tslib";
import { Component, Input } from '@angular/core';
import { ModalController, NavParams, ToastController } from '@ionic/angular';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { ApiService } from '../../_services/api/api.service';
import { first } from 'rxjs/operators';
var PasswordChangerModalPage = /** @class */ (function () {
    function PasswordChangerModalPage(toastController, http, router, storage, apiService, formBuilder, navParams, modalController) {
        this.toastController = toastController;
        this.http = http;
        this.router = router;
        this.storage = storage;
        this.apiService = apiService;
        this.formBuilder = formBuilder;
        this.navParams = navParams;
        this.modalController = modalController;
        this.buttonPressed = false;
        this.value = this.navParams.get('value');
    }
    PasswordChangerModalPage.prototype.ngOnInit = function () {
        this.passwordChangeForm = this.formBuilder.group({
            oldPassword: ['', Validators.required],
            password: ['', [Validators.required, Validators.minLength(6)]],
            repeatPassword: ['', [Validators.required, Validators.minLength(6)]]
        }, {
            validator: this.checkPasswords('password', 'repeatPassword')
        });
    };
    PasswordChangerModalPage.prototype.checkPasswords = function (controlName, matchingControlName) {
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
    PasswordChangerModalPage.prototype.onSubmit = function () {
        var _this = this;
        if (this.passwordChangeForm.invalid) {
            return;
        }
        this.buttonPressed = !this.buttonPressed;
        this.apiService.changePassword(this.passwordChangeForm.value.oldPassword, this.passwordChangeForm.value.password)
            .pipe(first())
            .subscribe(function (data) {
            _this.toast('Password successfully changed');
            _this.buttonPressed = !_this.buttonPressed;
            _this.dismiss();
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
    PasswordChangerModalPage.prototype.dismiss = function () {
        this.modalController.dismiss();
    };
    PasswordChangerModalPage.prototype.toast = function (message) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var toast;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.toastController.create({
                            message: message,
                            duration: 3000,
                            position: 'top',
                            color: "dark",
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
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Number)
    ], PasswordChangerModalPage.prototype, "value", void 0);
    PasswordChangerModalPage = tslib_1.__decorate([
        Component({
            selector: 'app-password-changer-modal',
            templateUrl: './password-changer-modal.page.html',
            styleUrls: ['./password-changer-modal.page.scss'],
        }),
        tslib_1.__metadata("design:paramtypes", [ToastController, HttpClient,
            Router, Storage,
            ApiService, FormBuilder,
            NavParams, ModalController])
    ], PasswordChangerModalPage);
    return PasswordChangerModalPage;
}());
export { PasswordChangerModalPage };
//# sourceMappingURL=password-changer-modal.page.js.map