import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { Tab3Page } from './tab3.page';
import {PasswordChangerModalPage} from '../../modals/password-changer-modal/password-changer-modal.page';
import {PasswordChangerModalPageModule} from '../../modals/password-changer-modal/password-changer-modal.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([{ path: '', component: Tab3Page }]),
    PasswordChangerModalPageModule
  ],
  declarations: [
    Tab3Page,
  ],
  entryComponents: [
  ]
})
export class Tab3PageModule {}
