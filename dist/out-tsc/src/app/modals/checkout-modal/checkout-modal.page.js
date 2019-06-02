import * as tslib_1 from "tslib";
import { Component, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { ApiService } from '../../_services/api/api.service';
import { ModalController, NavParams } from '@ionic/angular';
import { PayPal, PayPalPayment, PayPalConfiguration } from '@ionic-native/paypal/ngx';
var CheckoutModalPage = /** @class */ (function () {
    function CheckoutModalPage(http, storage, apiService, navParams, modalController, payPal) {
        this.http = http;
        this.storage = storage;
        this.apiService = apiService;
        this.navParams = navParams;
        this.modalController = modalController;
        this.payPal = payPal;
        this.currency = 'EUR';
        this.currencyIcon = '€';
        this.capsule = 'Capsule BCN';
        this.date = '2019-11-09';
        this.timeStart = '9:00';
        this.timeEnd = '11:00';
        this.paymentAmount = this.navParams.get('value');
    }
    CheckoutModalPage.prototype.ngOnInit = function () {
    };
    CheckoutModalPage.prototype.payWithPayPal = function () {
        var _this = this;
        this.payPal.init({
            PayPalEnvironmentProduction: 'Ae0rLWsukh4CEYjyOx2a1jO_27XN9ZUtvYcN1GTjfkPc2Q5e1rQlNRv-65ikwfgIct-5MoEx8fQJ9ssT',
            PayPalEnvironmentSandbox: 'AcuTHx8v5tlyGqbRiNVviT1-yc5MMciXSg1E1srIgObOU8Y5Q6sGyAw2taBmqBSgLDe5akHCe8aqmaO5',
        }).then(function () {
            _this.payPal.prepareToRender('PayPalEnvironmentSandbox', new PayPalConfiguration({})).then(function () {
                var payment = new PayPalPayment(_this.paymentAmount, _this.currency, 'Description', 'sale');
                _this.payPal.renderSinglePaymentUI(payment).then(function (res) {
                    console.log(res);
                    _this.dismiss();
                }, function (err) {
                    console.log("ERROR rendering");
                });
            }, function (err) { return console.log("ERROR configuration"); });
        }, function (err) { return console.log("ERROR initializing"); });
    };
    CheckoutModalPage.prototype.dismiss = function () {
        this.modalController.dismiss(this.paymentAmount);
    };
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", String)
    ], CheckoutModalPage.prototype, "paymentAmount", void 0);
    CheckoutModalPage = tslib_1.__decorate([
        Component({
            selector: 'app-checkout-modal',
            templateUrl: './checkout-modal.page.html',
            styleUrls: ['./checkout-modal.page.scss'],
        }),
        tslib_1.__metadata("design:paramtypes", [HttpClient,
            Storage, ApiService,
            NavParams, ModalController,
            PayPal])
    ], CheckoutModalPage);
    return CheckoutModalPage;
}());
export { CheckoutModalPage };
//# sourceMappingURL=checkout-modal.page.js.map