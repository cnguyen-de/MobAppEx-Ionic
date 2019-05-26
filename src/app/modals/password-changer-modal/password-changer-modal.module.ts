import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PasswordChangerModalPage } from './password-changer-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
  ],
  declarations: [
      PasswordChangerModalPage
  ],
  entryComponents: [
      PasswordChangerModalPage
  ],
  exports: [
      PasswordChangerModalPage
  ]
})
export class PasswordChangerModalPageModule {}
