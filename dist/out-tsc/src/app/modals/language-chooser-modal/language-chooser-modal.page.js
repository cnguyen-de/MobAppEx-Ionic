import * as tslib_1 from "tslib";
import { Component, Input } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { ApiService } from '../../_services/api/api.service';
var LanguageChooserModalPage = /** @class */ (function () {
    function LanguageChooserModalPage(http, storage, apiService, navParams, modalController) {
        this.http = http;
        this.storage = storage;
        this.apiService = apiService;
        this.navParams = navParams;
        this.modalController = modalController;
        this.value = this.navParams.get('value');
    }
    LanguageChooserModalPage.prototype.ngOnInit = function () {
    };
    LanguageChooserModalPage.prototype.chooseEnglish = function () {
        this.value = 'en';
        this.dismiss();
    };
    LanguageChooserModalPage.prototype.chooseGerman = function () {
        this.value = 'de';
        this.dismiss();
    };
    LanguageChooserModalPage.prototype.dismiss = function () {
        this.modalController.dismiss(this.value);
    };
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", String)
    ], LanguageChooserModalPage.prototype, "value", void 0);
    LanguageChooserModalPage = tslib_1.__decorate([
        Component({
            selector: 'app-language-chooser-modal',
            templateUrl: './language-chooser-modal.page.html',
            styleUrls: ['./language-chooser-modal.page.scss'],
        }),
        tslib_1.__metadata("design:paramtypes", [HttpClient,
            Storage, ApiService,
            NavParams, ModalController])
    ], LanguageChooserModalPage);
    return LanguageChooserModalPage;
}());
export { LanguageChooserModalPage };
//# sourceMappingURL=language-chooser-modal.page.js.map