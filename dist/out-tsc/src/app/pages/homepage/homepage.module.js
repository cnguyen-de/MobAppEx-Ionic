import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { HomepagePage } from './homepage.page';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpLoaderFactory } from '../../app.module';
import { HttpClient } from '@angular/common/http';
var routes = [
    {
        path: '',
        component: HomepagePage
    }
];
var HomepagePageModule = /** @class */ (function () {
    function HomepagePageModule() {
    }
    HomepagePageModule = tslib_1.__decorate([
        NgModule({
            imports: [
                CommonModule,
                FormsModule,
                IonicModule,
                RouterModule.forChild(routes),
                TranslateModule.forChild({
                    loader: {
                        provide: TranslateLoader,
                        useFactory: HttpLoaderFactory,
                        deps: [HttpClient]
                    }
                }),
            ],
            declarations: [HomepagePage]
        })
    ], HomepagePageModule);
    return HomepagePageModule;
}());
export { HomepagePageModule };
//# sourceMappingURL=homepage.module.js.map