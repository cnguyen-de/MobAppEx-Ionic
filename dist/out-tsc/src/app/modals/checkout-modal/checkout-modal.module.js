import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CheckoutModalPage } from './checkout-modal.page';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpLoaderFactory } from '../../app.module';
import { HttpClient } from '@angular/common/http';
var CheckoutModalPageModule = /** @class */ (function () {
    function CheckoutModalPageModule() {
    }
    CheckoutModalPageModule = tslib_1.__decorate([
        NgModule({
            imports: [
                CommonModule,
                FormsModule,
                IonicModule,
                ReactiveFormsModule,
                TranslateModule.forChild({
                    loader: {
                        provide: TranslateLoader,
                        useFactory: HttpLoaderFactory,
                        deps: [HttpClient]
                    }
                }),
            ],
            declarations: [
                CheckoutModalPage
            ],
            entryComponents: [
                CheckoutModalPage
            ]
        })
    ], CheckoutModalPageModule);
    return CheckoutModalPageModule;
}());
export { CheckoutModalPageModule };
//# sourceMappingURL=checkout-modal.module.js.map