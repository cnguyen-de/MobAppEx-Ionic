import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {ApiService} from '../../_services/api/api.service';
import {NativePageTransitions, NativeTransitionOptions} from '@ionic-native/native-page-transitions/ngx';
import {Router} from '@angular/router';

@Component({
  selector: 'app-password-recovery',
  templateUrl: './password-recovery.page.html',
  styleUrls: ['./password-recovery.page.scss'],
})
export class PasswordRecoveryPage implements OnInit {

  resetForm: FormGroup;
  buttonPressed = false;
  requestSuccess = false;
  options: NativeTransitionOptions = {
    direction: 'left',
    duration: 150,
    slowdownfactor: 2,
    androiddelay: 150,
  };
  forward: boolean = false;

  constructor(private apiService: ApiService, private toastController: ToastController,
              private formBuilder: FormBuilder, private nativePageTransitions: NativePageTransitions,
              private router: Router) { }

  ngOnInit() {
    this.resetForm = this.formBuilder.group({
      email: ['', Validators.required]
    });
  }
  ionViewDidEnter() {
    this.forward = false;
  }
  ionViewWillLeave() {
    if (!this.forward) {
      let options: NativeTransitionOptions = {
        direction: 'right',
        duration: 150,
        slowdownfactor: 2,
        androiddelay: 150,
      };
      this.nativePageTransitions.slide(options);
    }
  }

  onSubmit() {

    if (this.resetForm.invalid) {
      return;
    }
    this.buttonPressed = !this.buttonPressed;
    this.apiService.recoverPassword(this.resetForm.value.email).subscribe(
      data => {
        this.toast("Reset Email was sent to your address");
        this.buttonPressed = !this.buttonPressed;
      },
      error => {
        console.log(error);
        this.toast(error);
        this.buttonPressed = !this.buttonPressed;
    });
  }

  transitionTo(path) {
    this.forward = true;
    this.nativePageTransitions.slide(this.options);
    this.router.navigateByUrl(path);
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
