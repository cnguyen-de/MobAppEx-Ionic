import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
import { first } from 'rxjs/operators';


@Component({
  selector: 'app-registration',
  templateUrl: './registration.page.html',
  styleUrls: ['./registration.page.scss'],
})
export class RegistrationPage implements OnInit {

  registrationForm: FormGroup;
  buttonPressed = false;

  constructor(public toastController: ToastController, private http : HttpClient,
              private router : Router, public storage : Storage,
              private authenticationService: AuthService, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.registrationForm = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', Validators.required],
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

  submit() {
    if (this.registrationForm.invalid) {
      return;
    }
    this.buttonPressed = !this.buttonPressed;
    this.authenticationService.register(this.registrationForm.value.username,
                                        this.registrationForm.value.email,
                                        this.registrationForm.value.password)
        .pipe(first())
        .subscribe(
            data => {
              this.toast('Successfully registered');
              this.router.navigateByUrl('/login');
              this.buttonPressed = !this.buttonPressed;
            },
            error => {
              console.log(error);
              if (error.error.error.message) {
                this.toast(error.error.error.message)
              }
              this.buttonPressed = !this.buttonPressed;
            });
  }

  async toast(message: any) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }
}
