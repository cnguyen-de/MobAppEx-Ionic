import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { BookingHistoryPage } from './booking-history.page';

import {MatExpansionModule} from '@angular/material';

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
    // MatFormField,
    RouterModule.forChild(routes)
  ],
  declarations: [BookingHistoryPage]
})
export class BookingHistoryPageModule {}
