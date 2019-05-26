import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-password-recovery',
  templateUrl: './password-recovery.page.html',
  styleUrls: ['./password-recovery.page.scss'],
})
export class PasswordRecoveryPage implements OnInit {

  buttonPressed = false;
  requestSuccess = false;

  constructor(private toastController: ToastController) { }

  ngOnInit() {
  }

  onSubmit() {
    //No server logic
    this.buttonPressed = true;
    this.requestSuccess = true;
  }


  async toast(message: any) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      position: 'top',
      color: "dark"
    });
    toast.present();
  }
}
