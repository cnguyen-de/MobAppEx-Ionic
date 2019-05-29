import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LanguageChooserModalPage } from './language-chooser-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,

  ],
  declarations: [
      LanguageChooserModalPage
  ],
  entryComponents: [
      LanguageChooserModalPage
  ]
})
export class LanguageChooserModalPageModule {}
