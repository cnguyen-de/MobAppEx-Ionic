import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';
import { ThemeService } from './_services/theme/theme.service';
import { ApiService } from './_services/api/api.service';
import { first } from 'rxjs/operators';
var AppComponent = /** @class */ (function () {
    function AppComponent(platform, splashScreen, statusBar, storage, translateService, themeService, apiService) {
        var _this = this;
        this.platform = platform;
        this.splashScreen = splashScreen;
        this.statusBar = statusBar;
        this.storage = storage;
        this.translateService = translateService;
        this.themeService = themeService;
        this.apiService = apiService;
        this.initializeApp();
        this.initializeDB();
        this.getLanguagePref();
        this.setTheme();
        this.getUserInfo();
        this.currentUserSubscription = this.apiService.currentUser.subscribe(function (user) {
            _this.user = user;
        });
    }
    AppComponent.prototype.ngOnDestroy = function () {
        this.currentUserSubscription.unsubscribe();
    };
    AppComponent.prototype.initializeApp = function () {
        var _this = this;
        this.platform.ready().then(function () {
            _this.statusBar.styleDefault();
            _this.splashScreen.hide();
        });
    };
    AppComponent.prototype.initializeDB = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                this.setData('server', 'https://platania.info:3000/api');
                return [2 /*return*/];
            });
        });
    };
    AppComponent.prototype.getLanguagePref = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                this.storage.get('language').then(function (pref) {
                    if (typeof pref == 'string') {
                        _this.translateService.use(pref);
                    }
                    else {
                        _this.translateService.setDefaultLang('en');
                    }
                });
                return [2 /*return*/];
            });
        });
    };
    AppComponent.prototype.setTheme = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                this.storage.get('dark').then(function (dark) {
                    if (typeof dark == 'boolean') {
                        _this.themeService.enableDarkMode(dark);
                    }
                    else {
                        _this.themeService.enableDarkMode(false);
                    }
                });
                return [2 /*return*/];
            });
        });
    };
    AppComponent.prototype.getUserInfo = function () {
        var _this = this;
        this.apiService.getToken().then(function (data) {
            if (data != null) {
                _this.apiService.getUser(data).pipe(first()).subscribe(function (data) {
                    // @ts-ignore
                    _this.user = data;
                }, function (err) { return console.log(err); });
            }
        });
    };
    AppComponent.prototype.setData = function (key, value) {
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
    AppComponent = tslib_1.__decorate([
        Component({
            selector: 'app-root',
            templateUrl: 'app.component.html'
        }),
        tslib_1.__metadata("design:paramtypes", [Platform,
            SplashScreen,
            StatusBar,
            Storage,
            TranslateService,
            ThemeService,
            ApiService])
    ], AppComponent);
    return AppComponent;
}());
export { AppComponent };
//# sourceMappingURL=app.component.js.map