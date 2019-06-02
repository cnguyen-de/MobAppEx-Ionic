import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { LanguageChooserModalPage } from './language-chooser-modal.page';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpLoaderFactory } from '../../app.module';
import { HttpClient } from '@angular/common/http';
var LanguageChooserModalPageModule = /** @class */ (function () {
    function LanguageChooserModalPageModule() {
    }
    LanguageChooserModalPageModule = tslib_1.__decorate([
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
                LanguageChooserModalPage
            ],
            entryComponents: [
                LanguageChooserModalPage
            ]
        })
    ], LanguageChooserModalPageModule);
    return LanguageChooserModalPageModule;
}());
export { LanguageChooserModalPageModule };
//# sourceMappingURL=language-chooser-modal.module.js.map