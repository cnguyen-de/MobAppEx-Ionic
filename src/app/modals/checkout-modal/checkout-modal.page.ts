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
    let _this = this;

    setTimeout(() => {
      // Render the PayPal button into #paypal-button-container
      // @ts-ignore
      window.paypal.Buttons({
        style: {
          color:  'blue',
          shape:  'pill',
          label:  'pay',
          height: 40
        },
        // Set up the transaction
        createOrder: function (data, actions) {
          return actions.order.create({
            purchase_units: [{
              amount: {
                value: _this.paymentAmount
              }
            }]
          });
        },

        // Finalize the transaction
        onApprove: function (data, actions) {
          return actions.order.capture()
              .then(function (details) {
                // Show a success message to the buyer
                //alert('You have paid ' + _this.paymentAmount + ' for Capsule ' + _this.capsule);
                console.log(details);
                _this.modalController.dismiss(details.id);
              })
              .catch(err => {
                console.log(err);
              })
        }
      }).render('#paypal-button-container');
    }, 500)
  }

  ngOnInit() {
  }
}
