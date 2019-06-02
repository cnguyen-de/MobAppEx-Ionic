import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { PasswordRecoveryPage } from './password-recovery.page';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpLoaderFactory } from '../../app.module';
import { HttpClient } from '@angular/common/http';
var routes = [
    {
        path: '',
        component: PasswordRecoveryPage
    }
];
var PasswordRecoveryPageModule = /** @class */ (function () {
    function PasswordRecoveryPageModule() {
    }
    PasswordRecoveryPageModule = tslib_1.__decorate([
        NgModule({
            imports: [
                CommonModule,
                FormsModule,
                IonicModule,
                ReactiveFormsModule,
                RouterModule.forChild(routes),
                TranslateModule.forChild({
                    loader: {
                        provide: TranslateLoader,
                        useFactory: HttpLoaderFactory,
                        deps: [HttpClient]
                    }
                }),
            ],
            declarations: [PasswordRecoveryPage]
        })
    ], PasswordRecoveryPageModule);
    return PasswordRecoveryPageModule;
}());
export { PasswordRecoveryPageModule };
//# sourceMappingURL=password-recovery.module.js.map