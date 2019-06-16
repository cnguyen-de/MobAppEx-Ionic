import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab2Page } from './tab2.page';
import { AgmCoreModule } from '@agm/core';
import { TranslateLoader, TranslateModule} from '@ngx-translate/core';
import { HttpLoaderFactory} from '../../app.module';
import { HttpClient} from '@angular/common/http';
import {CheckoutModalPageModule} from '../../modals/checkout-modal/checkout-modal.module';
import { MatDatepickerModule, MatNativeDateModule } from '@angular/material';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    RouterModule.forChild([{ path: '', component: Tab2Page }]),
    AgmCoreModule.forRoot({ apiKey: 'AIzaSyCpckjti0hdTk60mKWuq9R_uHsbQtw88IU' }),
    CheckoutModalPageModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),

  ],
  declarations: [Tab2Page]
})
export class Tab2PageModule {}
