import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-password-recovery',
  templateUrl: './password-recovery.page.html',
  styleUrls: ['./password-recovery.page.scss'],
})
export class PasswordRecoveryPage implements OnInit {

  buttonPressed = false;
  requestSuccess = false;

  constructor() { }

  ngOnInit() {
  }

  onSubmit() {
    //No server logic
    this.buttonPressed = true;
    this.requestSuccess = true;
  }
}
