import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule } from '@angular/router';
import { SlidesGuard } from './guards/slides.guard';
import { TabsGuard } from './guards/tabs.guard';
var routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'tabs', redirectTo: 'tabs/tab1', pathMatch: 'full' },
    { path: 'slides', loadChildren: './pages/slides/slides.module#SlidesPageModule' },
    { path: 'home', loadChildren: './pages/homepage/homepage.module#HomepagePageModule', canActivate: [SlidesGuard] },
    { path: '', loadChildren: './pages/tabs/tabs.module#TabsPageModule', canActivate: [TabsGuard] },
    { path: 'registration', loadChildren: './pages/registration/registration.module#RegistrationPageModule', canActivate: [SlidesGuard] },
    { path: 'login', loadChildren: './pages/login/login.module#LoginPageModule', canActivate: [SlidesGuard] },
    { path: 'recovery', loadChildren: './pages/password-recovery/password-recovery.module#PasswordRecoveryPageModule', canActivate: [SlidesGuard] },
];
var AppRoutingModule = /** @class */ (function () {
    function AppRoutingModule() {
    }
    AppRoutingModule = tslib_1.__decorate([
        NgModule({
            imports: [
                RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
            ],
            exports: [RouterModule]
        })
    ], AppRoutingModule);
    return AppRoutingModule;
}());
export { AppRoutingModule };
//# sourceMappingURL=app-routing.module.js.map