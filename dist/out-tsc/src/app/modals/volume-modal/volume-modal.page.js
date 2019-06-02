import * as tslib_1 from "tslib";
import { Component, Input } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { ApiService } from '../../_services/api/api.service';
var VolumeModalPage = /** @class */ (function () {
    function VolumeModalPage(http, storage, apiService, navParams, modalController) {
        this.http = http;
        this.storage = storage;
        this.apiService = apiService;
        this.navParams = navParams;
        this.modalController = modalController;
        this.value = this.navParams.get('value');
    }
    VolumeModalPage.prototype.ngOnInit = function () {
        this.sliderValue = this.value;
    };
    VolumeModalPage.prototype.onChange = function () {
        this.value = this.sliderValue;
    };
    VolumeModalPage.prototype.dismiss = function () {
        this.modalController.dismiss(this.value);
    };
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Number)
    ], VolumeModalPage.prototype, "value", void 0);
    VolumeModalPage = tslib_1.__decorate([
        Component({
            selector: 'app-volume-modal',
            templateUrl: './volume-modal.page.html',
            styleUrls: ['./volume-modal.page.scss'],
        }),
        tslib_1.__metadata("design:paramtypes", [HttpClient,
            Storage, ApiService,
            NavParams, ModalController])
    ], VolumeModalPage);
    return VolumeModalPage;
}());
export { VolumeModalPage };
//# sourceMappingURL=volume-modal.page.js.map