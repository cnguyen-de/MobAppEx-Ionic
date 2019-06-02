import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { LightModalPage } from './light-modal.page';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpLoaderFactory } from '../../app.module';
import { HttpClient } from '@angular/common/http';
var LightModalPageModule = /** @class */ (function () {
    function LightModalPageModule() {
    }
    LightModalPageModule = tslib_1.__decorate([
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
                LightModalPage
            ],
            entryComponents: [
                LightModalPage
            ]
        })
    ], LightModalPageModule);
    return LightModalPageModule;
}());
export { LightModalPageModule };
//# sourceMappingURL=light-modal.module.js.map