import * as tslib_1 from "tslib";
import { Component, Input } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { ApiService } from '../../_services/api/api.service';
var LightModalPage = /** @class */ (function () {
    function LightModalPage(http, storage, apiService, navParams, modalController) {
        this.http = http;
        this.storage = storage;
        this.apiService = apiService;
        this.navParams = navParams;
        this.modalController = modalController;
        this.value = this.navParams.get('value');
    }
    LightModalPage.prototype.ngOnInit = function () {
        this.sliderValue = this.value;
    };
    LightModalPage.prototype.onChange = function () {
        this.value = this.sliderValue;
    };
    LightModalPage.prototype.dismiss = function () {
        this.modalController.dismiss(this.value);
    };
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Number)
    ], LightModalPage.prototype, "value", void 0);
    LightModalPage = tslib_1.__decorate([
        Component({
            selector: 'app-light-modal',
            templateUrl: './light-modal.page.html',
            styleUrls: ['./light-modal.page.scss'],
        }),
        tslib_1.__metadata("design:paramtypes", [HttpClient,
            Storage, ApiService,
            NavParams, ModalController])
    ], LightModalPage);
    return LightModalPage;
}());
export { LightModalPage };
//# sourceMappingURL=light-modal.page.js.map