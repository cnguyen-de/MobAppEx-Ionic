import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { VolumeModalPage } from './volume-modal.page';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpLoaderFactory } from '../../app.module';
import { HttpClient } from '@angular/common/http';
var VolumeModalPageModule = /** @class */ (function () {
    function VolumeModalPageModule() {
    }
    VolumeModalPageModule = tslib_1.__decorate([
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
                VolumeModalPage
            ],
            entryComponents: [
                VolumeModalPage
            ]
        })
    ], VolumeModalPageModule);
    return VolumeModalPageModule;
}());
export { VolumeModalPageModule };
//# sourceMappingURL=volume-modal.module.js.map