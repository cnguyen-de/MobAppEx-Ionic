import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { SlidesGuard } from './guards/slides.guard';
import { TabsGuard } from './guards/tabs.guard';

const routes: Routes = [
  { path: 'tabs', redirectTo: 'tabs/tab1', pathMatch: 'full' },
  { path: 'slides', loadChildren: './pages/slides/slides.module#SlidesPageModule' },
  { path: '', loadChildren: './pages/homepage/homepage.module#HomepagePageModule', canActivate: [SlidesGuard] },
  { path: '', loadChildren: './pages/tabs/tabs.module#TabsPageModule', canActivate: [TabsGuard] }, // when path isn't '', the whole tabs site breaks????
  { path: 'registration', loadChildren: './pages/registration/registration.module#RegistrationPageModule' },
  { path: 'login', loadChildren: './pages/login/login.module#LoginPageModule' },


];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
