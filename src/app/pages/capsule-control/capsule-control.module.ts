import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CapsuleControlPage } from './capsule-control.page';

const routes: Routes = [
  {
    path: '',
    component: CapsuleControlPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [CapsuleControlPage]
})
export class CapsuleControlPageModule {}
