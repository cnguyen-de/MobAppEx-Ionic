import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { SlidesGuard } from './guards/slides.guard';
import { TabsGuard } from './guards/tabs.guard';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full'},
  { path: 'tabs', redirectTo: 'tabs/tab1', pathMatch: 'full' },
  { path: 'slides', loadChildren: './pages/slides/slides.module#SlidesPageModule' },
  { path: 'home', loadChildren: './pages/homepage/homepage.module#HomepagePageModule', canActivate: [SlidesGuard] },
  { path: '', loadChildren: './pages/tabs/tabs.module#TabsPageModule', canActivate: [TabsGuard] }, // see pages/tabs/tabs.router.module.ts
  { path: 'registration', loadChildren: './pages/registration/registration.module#RegistrationPageModule', canActivate: [SlidesGuard]  },
  { path: 'login', loadChildren: './pages/login/login.module#LoginPageModule', canActivate: [SlidesGuard]  },
  { path: 'recovery', loadChildren: './pages/password-recovery/password-recovery.module#PasswordRecoveryPageModule', canActivate: [SlidesGuard]  },
  { path: 'this-app', loadChildren: './pages/this-app/this-app.module#ThisAppPageModule' },
  { path: 'booking-history', loadChildren: './pages/booking-history/booking-history.module#BookingHistoryPageModule', canActivate: [TabsGuard] },


];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
