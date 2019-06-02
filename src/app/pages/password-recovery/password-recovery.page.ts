import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {ApiService} from '../../_services/api/api.service';

@Component({
  selector: 'app-password-recovery',
  templateUrl: './password-recovery.page.html',
  styleUrls: ['./password-recovery.page.scss'],
})
export class PasswordRecoveryPage implements OnInit {

  resetForm: FormGroup;
  buttonPressed = false;
  requestSuccess = false;

  constructor(private apiService: ApiService, private toastController: ToastController, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.resetForm = this.formBuilder.group({
      email: ['', Validators.required]
    });
  }

  onSubmit() {

    if (this.resetForm.invalid) {
      return;
    }
    this.buttonPressed = !this.buttonPressed;
    this.apiService.recoverPassword(this.resetForm.value.email).subscribe(
      data => {
        console.log(data)
        this.buttonPressed = !this.buttonPressed;
      },
      error => {
        console.log(error);
        this.toast(error);
        this.buttonPressed = !this.buttonPressed;
    });
  }


  async toast(message: any) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      position: 'top',
      cssClass: 'toast-container',
    });
    toast.present();
  }
}
