import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { PasswordChangerModalPage } from '../../modals/password-changer-modal/password-changer-modal.page';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { ThemeService } from '../../_services/theme/theme.service';
import { LanguageChooserModalPage } from '../../modals/language-chooser-modal/language-chooser-modal.page';
import { VolumeModalPage } from '../../modals/volume-modal/volume-modal.page';
import { LightModalPage } from '../../modals/light-modal/light-modal.page';
import { first } from 'rxjs/operators';
import { ApiService } from '../../_services/api/api.service';
import { TranslateService } from '@ngx-translate/core';
var Tab3Page = /** @class */ (function () {
    function Tab3Page(modalController, storage, router, themeService, alertController, toastController, apiService, translateService) {
        this.modalController = modalController;
        this.storage = storage;
        this.router = router;
        this.themeService = themeService;
        this.alertController = alertController;
        this.toastController = toastController;
        this.apiService = apiService;
        this.translateService = translateService;
        this.lightPref = 0;
        this.volumePref = 0;
        this.getUserInfo();
        this.getDarkValue();
    }
    // User Info
    Tab3Page.prototype.getUserInfo = function () {
        var _this = this;
        this.storage.get('user').then(function (user) {
            _this.username = user.username;
            _this.email = user.email;
            if (user.capsulePreference != null) {
                _this.lightPref = user.capsulePreference.LightLevel;
                _this.volumePref = user.capsulePreference.VolumenLevel;
            }
        });
    };
    //Change Password
    Tab3Page.prototype.changePasswordModal = function () {
        this.presentPasswordChangerModal();
    };
    Tab3Page.prototype.presentPasswordChangerModal = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var modal;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.modalController.create({
                            component: PasswordChangerModalPage,
                            componentProps: {
                                value: 123
                            },
                            cssClass: 'password-changer-modal'
                        })];
                    case 1:
                        modal = _a.sent();
                        return [4 /*yield*/, modal.present()];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    //Log Out
    Tab3Page.prototype.logOut = function () {
        this.presentAlertConfirm();
    };
    Tab3Page.prototype.presentAlertConfirm = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var alert;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.alertController.create({
                            cssClass: 'alert-dialog',
                            header: 'Are you sure?',
                            message: 'Your preferences are saved, you will need to log in again to use the app',
                            buttons: [
                                {
                                    text: 'Cancel',
                                    role: 'cancel',
                                    cssClass: 'secondary',
                                    handler: function () {
                                    }
                                }, {
                                    text: 'Log out',
                                    handler: function () {
                                        _this.apiService.logOut()
                                            .pipe(first())
                                            .subscribe(function (data) {
                                            _this.apiService.logOutLocally();
                                            _this.router.navigateByUrl('/');
                                        }, function (error) {
                                            console.log(error);
                                        });
                                    }
                                }
                            ]
                        })];
                    case 1:
                        alert = _a.sent();
                        return [4 /*yield*/, alert.present()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    //Change Language
    Tab3Page.prototype.changeLanguage = function () {
        this.presentLanguageChooserModal();
    };
    Tab3Page.prototype.presentLanguageChooserModal = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var modal;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.modalController.create({
                            component: LanguageChooserModalPage,
                            componentProps: {
                                value: 'en'
                            },
                            cssClass: 'chooser-modal'
                        })];
                    case 1:
                        modal = _a.sent();
                        modal.onDidDismiss().then(function (value) {
                            if (typeof value.data == 'string') {
                                _this.translateService.use(value.data);
                                _this.saveToStorage('language', value.data);
                                switch (value.data) {
                                    case 'en':
                                        _this.toast("Language set to English!");
                                        break;
                                    case 'de':
                                        _this.toast("Sprache als Deutsch gesetzt!");
                                        break;
                                }
                            }
                        });
                        return [4 /*yield*/, modal.present()];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    //Switch Light-Dark Theme
    Tab3Page.prototype.switchTheme = function () {
        this.darkMode = !this.darkMode;
        this.themeService.enableDarkMode(this.darkMode);
        this.saveToStorage('dark', this.darkMode);
    };
    //Choose Volume Preference
    Tab3Page.prototype.changeVolume = function () {
        this.presentVolumeChangerModal();
    };
    Tab3Page.prototype.presentVolumeChangerModal = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var modal;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.modalController.create({
                            component: VolumeModalPage,
                            componentProps: {
                                value: this.volumePref
                            },
                            cssClass: 'chooser-modal'
                        })];
                    case 1:
                        modal = _a.sent();
                        modal.onDidDismiss().then(function (value) {
                            if (typeof value.data == 'number') {
                                _this.volumePref = value.data;
                                _this.toast("Volume preference set to: " + _this.volumePref);
                            }
                        });
                        return [4 /*yield*/, modal.present()];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    //Choose Light Preference
    Tab3Page.prototype.changeLight = function () {
        this.presentLightChangerModal();
    };
    Tab3Page.prototype.presentLightChangerModal = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var modal;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.modalController.create({
                            component: LightModalPage,
                            componentProps: {
                                value: this.lightPref
                            },
                            cssClass: 'chooser-modal'
                        })];
                    case 1:
                        modal = _a.sent();
                        modal.onDidDismiss().then(function (value) {
                            if (typeof value.data == 'number') {
                                _this.lightPref = value.data;
                                _this.toast("Light preference set to: " + _this.lightPref);
                            }
                        });
                        return [4 /*yield*/, modal.present()];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Tab3Page.prototype.bookingHistory = function () {
        console.log("Bla");
    };
    //Toast Handler
    Tab3Page.prototype.toast = function (message) {
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
    Tab3Page.prototype.saveToStorage = function (key, value) {
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
    Tab3Page.prototype.getDarkValue = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, this.storage.get('dark')];
                    case 1:
                        _a.darkMode = _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Tab3Page = tslib_1.__decorate([
        Component({
            selector: 'app-tab3',
            templateUrl: 'tab3.page.html',
            styleUrls: ['tab3.page.scss']
        }),
        tslib_1.__metadata("design:paramtypes", [ModalController, Storage,
            Router, ThemeService,
            AlertController, ToastController,
            ApiService,
            TranslateService])
    ], Tab3Page);
    return Tab3Page;
}());
export { Tab3Page };
//# sourceMappingURL=tab3.page.js.map