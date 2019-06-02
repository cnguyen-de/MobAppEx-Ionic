import * as tslib_1 from "tslib";
import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { StatusBar } from '@ionic-native/status-bar/ngx';
var ThemeService = /** @class */ (function () {
    function ThemeService(document, statusBar) {
        this.document = document;
        this.statusBar = statusBar;
        this.currentTheme = '';
    }
    ThemeService.prototype.setPrimaryColor = function (color) {
        this.setVariable('--ion-color-primary', color);
    };
    ThemeService.prototype.setVariable = function (name, value) {
        this.currentTheme = name + ": " + value + ";";
        this.document.documentElement.style.setProperty(name, value);
    };
    ThemeService.prototype.enableDarkMode = function (enableDarkMode) {
        var theme = this.getLightTheme();
        if (enableDarkMode) {
            theme = this.getDarkTheme();
            this.statusBar.backgroundColorByHexString('#141d26');
            this.statusBar.styleBlackOpaque();
        }
        else {
            this.statusBar.backgroundColorByHexString('#ffffff');
            this.statusBar.styleDefault();
        }
        this.document.documentElement.style.cssText = theme;
    };
    ThemeService.prototype.getDarkTheme = function () {
        return "\n      " + this.currentTheme + "\n      --ion-background-color: #141d26;\n      --ion-item-background-color: #243447;\n      --ion-toolbar-background: #243447;\n      --ion-border-color: #243447;\n      \n      --darker-color: #141d26;\n      --background-surface-color: #243447;\n      --modal-color: #243447;\n      --toast-color: #243447;\n      --ion-inverted-color: #fff;\n\n      --ion-color-primary: #0084b4;\n      --ion-text-color: #fff;\n      --ion-text-color-step-400: #fff;\n      --ion-text-color-step-600: #fff;\n    ";
    };
    ThemeService.prototype.getLightTheme = function () {
        return "\n      " + this.currentTheme + "\n      --ion-background-color: #fff;\n      --ion-item-background-color: #fff;\n      --ion-toolbar-background: #fff;\n      --ion-border-color: #d8d8d8;\n      \n      --darker-color: #efefef;\n      --background-surface-color: #efefef;\n      --modal-color: #fff;\n      --toast-color: #000;\n      --ion-inverted-color: #fff;\n\n      --ion-color-primary: #08a0e9;\n      --ion-text-color: #222;\n      --ion-text-color-step-400: #222;\n      --ion-text-color-step-600: #222;\n    ";
    };
    ThemeService = tslib_1.__decorate([
        Injectable({
            providedIn: 'root'
        }),
        tslib_1.__param(0, Inject(DOCUMENT)),
        tslib_1.__metadata("design:paramtypes", [Document,
            StatusBar])
    ], ThemeService);
    return ThemeService;
}());
export { ThemeService };
//# sourceMappingURL=theme.service.js.map