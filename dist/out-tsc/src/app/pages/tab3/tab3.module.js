import * as tslib_1 from "tslib";
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Tab3Page } from './tab3.page';
import { PasswordChangerModalPageModule } from '../../modals/password-changer-modal/password-changer-modal.module';
import { LanguageChooserModalPageModule } from '../../modals/language-chooser-modal/language-chooser-modal.module';
import { LightModalPageModule } from '../../modals/light-modal/light-modal.module';
import { VolumeModalPageModule } from '../../modals/volume-modal/volume-modal.module';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpLoaderFactory } from '../../app.module';
import { HttpClient } from '@angular/common/http';
var Tab3PageModule = /** @class */ (function () {
    function Tab3PageModule() {
    }
    Tab3PageModule = tslib_1.__decorate([
        NgModule({
            imports: [
                IonicModule,
                CommonModule,
                FormsModule,
                ReactiveFormsModule,
                RouterModule.forChild([{ path: '', component: Tab3Page }]),
                PasswordChangerModalPageModule,
                LanguageChooserModalPageModule,
                LightModalPageModule,
                VolumeModalPageModule,
                TranslateModule.forChild({
                    loader: {
                        provide: TranslateLoader,
                        useFactory: HttpLoaderFactory,
                        deps: [HttpClient]
                    }
                }),
            ],
            declarations: [
                Tab3Page,
            ],
            entryComponents: [
                Tab3Page
            ]
        })
    ], Tab3PageModule);
    return Tab3PageModule;
}());
export { Tab3PageModule };
//# sourceMappingURL=tab3.module.js.map