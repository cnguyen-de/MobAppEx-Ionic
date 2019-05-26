import {Component, Input, OnInit} from '@angular/core';
import {ModalController, NavParams, ToastController} from '@ionic/angular';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {Storage} from '@ionic/storage';
import {ApiService} from '../../_services/api.service';
import {first} from 'rxjs/operators';

@Component({
  selector: 'app-password-changer-modal',
  templateUrl: './password-changer-modal.page.html',
  styleUrls: ['./password-changer-modal.page.scss'],
})
export class PasswordChangerModalPage implements OnInit {

  @Input() value: number;

  passwordChangeForm: FormGroup;
  buttonPressed = false;

  constructor(public toastController: ToastController, private http : HttpClient,
              private router : Router, public storage : Storage,
              private apiService: ApiService, private formBuilder: FormBuilder,
              private navParams: NavParams, private modalController: ModalController) {
    this.value = this.navParams.get('value')
  }

  ngOnInit() {
    this.passwordChangeForm = this.formBuilder.group({
      oldPassword: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      repeatPassword: ['', [Validators.required, Validators.minLength(6)]]
    }, {
      validator: this.checkPasswords('password', 'repeatPassword')
    });
  }


  checkPasswords(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors.mustMatch) {
        // return if another validator has already found an error on the matchingControl
        return;
      }

      // set error on matchingControl if validation fails
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    }
  }

  onSubmit() {
    if (this.passwordChangeForm.invalid) {
      return;
    }
    this.buttonPressed = !this.buttonPressed;
    this.apiService.changePassword(this.passwordChangeForm.value.oldPassword,
        this.passwordChangeForm.value.password)
        .pipe(first())
        .subscribe(
            data => {
              this.toast('Password successfully changed');
              this.buttonPressed = !this.buttonPressed;
            },
            error => {
              this.buttonPressed = !this.buttonPressed;
              console.log(error);
              if (error.status === 0 || error.status === 504) {
                this.toast("Unable to communicate with server")
              } else if (error.error.error.message) {
                this.toast(error.error.error.message)
              }
            });
  }


  dismiss() {
    this.modalController.dismiss();
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
