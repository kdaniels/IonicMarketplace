import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { environment } from '../../../environments/environment';
import { LoadingController, ToastController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { Router } from '@angular/router';

declare var Stripe;

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss']
})
export class CheckoutPage implements OnInit {
  dataForm: FormGroup;
  cart = [];
  email = '';

  // Stripe variables
  stripe;
  card;
  cardErrors;

  @ViewChild('cardElement', { static: true }) cardElement: ElementRef;

  constructor(
    private loadingCtrl: LoadingController,
    private fb: FormBuilder,
    private authService: AuthService,
    private productService: ProductService,
    private toastCtrl: ToastController,
    private cartService: CartService,
    private router: Router
  ) { }

  ngOnInit() {
    this.cartService.getCart().subscribe(res => {
      this.cart = res;
      this.authService.getEmails();
    });

    this.authService.getEmail().then(res => {
      const email = res;
      this.email = email;
    });

/*     this.authService.getEmail().then(function(result) {
      this.email = result;
    }); */

    // post refers to post code
    this.dataForm = this.fb.group({
      name: ['', Validators.required],
      post: ['', Validators.required],
      street: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required]
    });

    this.stripe = Stripe(environment.stripe_key);
    const elements = this.stripe.elements();

    this.card = elements.create('card');
    this.card.mount(this.cardElement.nativeElement);

    this.card.addEventListener('change', ({ error }) => {
      console.log('error: ', error);
      this.cardErrors = error && error.message;
    });

  }

  getTotal() {
    return this.cart.reduce((i, j) => i + j.price * j.amount, 0);
  }

  async buyNow() {
    const stripeData = {
      payment_method_data: {
        billing_details: {
          name: this.dataForm.get('name').value,
          address: {
            line1: this.dataForm.get('street').value,
            city: this.dataForm.get('city').value,
            postal_code: this.dataForm.get('post').value,
            country: this.dataForm.get('country').value
          },
          email: this.email//this.authService.getEmails()
        }
      },
      receipt_email: this.email//this.authService.getEmails()
    };

    const items = this.cart.map(item => {
      return { id: item.id, amount: item.amount };
    });

    const loading = await this.loadingCtrl.create();
    await loading.present();

    (await this.productService.startPaymentIntent(this.getTotal() * 100, items)).subscribe(async paymentIntent => {
      console.log('Payment Intent', paymentIntent);
      const secret = paymentIntent.client_secret;

      const { result, err } = await this.stripe.handleCardPayment(
        secret,
        this.card,
        stripeData
      );

      console.log('result: ', result);

      if (err) {
        await loading.dismiss();
        const toast = await this.toastCtrl.create({
          message: 'Payment could not be processed, please try again',
          duration: 3000
        });
        await toast.present();
      } else {
        await loading.dismiss();
        const toast = await this.toastCtrl.create({
          message: 'Thank you for your order!',
          duration: 3000
        });
        await toast.present();
        this.router.navigateByUrl('/buyer/list');
      }
    }, async err => {
      await loading.dismiss();
      const toast = await this.toastCtrl.create({
        message: `Payment could not be processed, please try again`,
        duration: 3000
      });
      await toast.present();
    });
  }
}