import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VolumeModalPage } from './volume-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
  ],
  declarations: [
      VolumeModalPage
  ],
  entryComponents: [
      VolumeModalPage
  ]
})
export class VolumeModalPageModule {}
