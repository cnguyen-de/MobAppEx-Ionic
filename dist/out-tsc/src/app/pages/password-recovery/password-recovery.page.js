import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../../_services/api/api.service';
var PasswordRecoveryPage = /** @class */ (function () {
    function PasswordRecoveryPage(apiService, toastController, formBuilder) {
        this.apiService = apiService;
        this.toastController = toastController;
        this.formBuilder = formBuilder;
        this.buttonPressed = false;
        this.requestSuccess = false;
    }
    PasswordRecoveryPage.prototype.ngOnInit = function () {
        this.resetForm = this.formBuilder.group({
            email: ['', Validators.required]
        });
    };
    PasswordRecoveryPage.prototype.onSubmit = function () {
        var _this = this;
        if (this.resetForm.invalid) {
            return;
        }
        this.buttonPressed = !this.buttonPressed;
        this.apiService.recoverPassword(this.resetForm.value.email).subscribe(function (data) {
            console.log(data);
            _this.buttonPressed = !_this.buttonPressed;
        }, function (error) {
            console.log(error);
            _this.toast(error);
            _this.buttonPressed = !_this.buttonPressed;
        });
    };
    PasswordRecoveryPage.prototype.toast = function (message) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var toast;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.toastController.create({
                            message: message,
                            duration: 3000,
                            position: 'top',
                            cssClass: 'toast-container',
                        })];
                    case 1:
                        toast = _a.sent();
                        toast.present();
                        return [2 /*return*/];
                }
            });
        });
    };
    PasswordRecoveryPage = tslib_1.__decorate([
        Component({
            selector: 'app-password-recovery',
            templateUrl: './password-recovery.page.html',
            styleUrls: ['./password-recovery.page.scss'],
        }),
        tslib_1.__metadata("design:paramtypes", [ApiService, ToastController, FormBuilder])
    ], PasswordRecoveryPage);
    return PasswordRecoveryPage;
}());
export { PasswordRecoveryPage };
//# sourceMappingURL=password-recovery.page.js.map