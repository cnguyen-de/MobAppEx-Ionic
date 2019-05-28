import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { Tab3Page } from './tab3.page';
import {PasswordChangerModalPageModule} from '../../modals/password-changer-modal/password-changer-modal.module';
import {LanguageChooserModalPageModule} from '../../modals/language-chooser-modal/language-chooser-modal.module';
import {LightModalPageModule} from '../../modals/light-modal/light-modal.module';
import {VolumeModalPageModule} from '../../modals/volume-modal/volume-modal.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([{ path: '', component: Tab3Page }]),
    PasswordChangerModalPageModule,
    LanguageChooserModalPageModule,
    LightModalPageModule,
    VolumeModalPageModule
  ],
  declarations: [
    Tab3Page,
  ],
  entryComponents: [
    Tab3Page
  ]
})
export class Tab3PageModule {}
