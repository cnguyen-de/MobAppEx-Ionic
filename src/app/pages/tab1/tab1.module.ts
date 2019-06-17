import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab1Page } from './tab1.page';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {HttpLoaderFactory} from '../../app.module';
import {HttpClient} from '@angular/common/http';
import {MatExpansionModule} from '@angular/material';
import {NgxSimpleCountdownModule} from 'ngx-simple-countdown';
import {CheckoutModalPageModule} from '../../modals/checkout-modal/checkout-modal.module';
import {ExtendCapsuleModalPageModule} from '../../modals/extend-capsule-modal/extend-capsule-modal.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    MatExpansionModule,
    NgxSimpleCountdownModule,
    CheckoutModalPageModule,
    ExtendCapsuleModalPageModule,
    RouterModule.forChild([{ path: '', component: Tab1Page }]),
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),

  ],
  declarations: [Tab1Page]
})
export class Tab1PageModule {}
