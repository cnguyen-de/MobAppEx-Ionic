import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {HttpLoaderFactory} from '../../app.module';
import {HttpClient} from '@angular/common/http';
import { IonicModule } from '@ionic/angular';

import { BookingHistoryPage } from './booking-history.page';

import {MatExpansionModule, MatDatepickerModule, MatFormFieldModule, MatNativeDateModule, MatInputModule} from '@angular/material';

const routes: Routes = [
  {
    path: '',
    component: BookingHistoryPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MatExpansionModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatInputModule,
    RouterModule.forChild(routes),
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
  ],
  declarations: [BookingHistoryPage],
  // providers: [MatDatepickerModule]
})
export class BookingHistoryPageModule {}
