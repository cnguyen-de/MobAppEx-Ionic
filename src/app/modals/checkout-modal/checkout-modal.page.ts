import {Component, Input, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Storage} from '@ionic/storage';
import {ApiService} from '../../_services/api/api.service';
import {ModalController, NavParams} from '@ionic/angular';
import { PayPal, PayPalPayment, PayPalConfiguration } from '@ionic-native/paypal/ngx';

@Component({
  selector: 'app-checkout-modal',
  templateUrl: './checkout-modal.page.html',
  styleUrls: ['./checkout-modal.page.scss'],
})
export class CheckoutModalPage implements OnInit {
  @Input() paymentAmount: string;
  currency: string = 'EUR';
  currencyIcon: string = '€';

  capsule: string;
  date: string;
  timeStart: string;
  timeEnd: string;


  constructor(private http : HttpClient,
              public storage : Storage, private apiService: ApiService,
              private navParams: NavParams, private modalController: ModalController,
              private payPal: PayPal) {
    this.paymentAmount = this.navParams.get('paymentAmount');
    this.capsule = this.navParams.get('capsule');
    this.date = this.navParams.get('date');
    this.timeStart = this.navParams.get('timeStart');
    this.timeEnd = this.navParams.get('timeEnd');
  }

  ngOnInit() {
  }

  payWithPayPal() {
    this.payPal.init({
      PayPalEnvironmentProduction: 'Ae0rLWsukh4CEYjyOx2a1jO_27XN9ZUtvYcN1GTjfkPc2Q5e1rQlNRv-65ikwfgIct-5MoEx8fQJ9ssT',
      PayPalEnvironmentSandbox: 'AcuTHx8v5tlyGqbRiNVviT1-yc5MMciXSg1E1srIgObOU8Y5Q6sGyAw2taBmqBSgLDe5akHCe8aqmaO5',
    }).then(() => {
      this.payPal.prepareToRender('PayPalEnvironmentSandbox', new PayPalConfiguration({

      })).then(() => {
        let payment = new PayPalPayment(this.paymentAmount, this.currency, 'Description', 'sale');
        this.payPal.renderSinglePaymentUI(payment).then((res) => {
          console.log(res);
          this.modalController.dismiss(res.response.id);
        }, (err) => {
          console.log("ERROR rendering")
        })
      }, (err) => console.log("ERROR configuration"))
    }, (err) => console.log("ERROR initializing"))
  }
}
