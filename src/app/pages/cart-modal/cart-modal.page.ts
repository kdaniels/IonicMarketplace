import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart-modal',
  templateUrl: './cart-modal.page.html',
  styleUrls: ['./cart-modal.page.scss'],
})
export class CartModalPage implements OnInit {
  cart = [];

  constructor(private cartService: CartService, private modalController: ModalController,
    private router: Router) { }

  ngOnInit() {
    this.cartService.getCart().subscribe(res => {
      this.cart = res;
    });
  }

  decreaseCartItem(product) {
    this.cartService.decreaseProduct(product);
  }

  increaseCartItem(product) {
    this.cartService.addProduct(product);
  }

  removeCartItem(product) {
    this.cartService.removeProduct(product);
  }

  getTotal() {
    return this.cart.reduce((i, j) => i + j.price * j.amount, 0);
  }

  checkout() {
    this.closeModal();
    this.router.navigateByUrl('/buyer/checkout');
    console.log('Call for checkout here -- IMPLEMENT');
  }

  closeModal() {
    this.modalController.dismiss();
  }

}
