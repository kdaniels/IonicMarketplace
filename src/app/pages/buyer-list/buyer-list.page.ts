import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';
import { CartModalPage } from '../cart-modal/cart-modal.page';
import { BuyerListDetailsPage } from '../buyer-list-details/buyer-list-details.page';
import { AccountPage } from '../account/account.page';

@Component({
  selector: 'app-buyer-list',
  templateUrl: './buyer-list.page.html',
  styleUrls: ['./buyer-list.page.scss'],
})
export class BuyerListPage implements OnInit {
  products: Observable<any>;
  user: any;
  cartItemCount: BehaviorSubject<number> = this.cartService.getCartItemCount();

  constructor(private auth: AuthService, private productService: ProductService,
    private cartService: CartService, private modalController: ModalController) { }

  ngOnInit() {
    this.products = this.productService.getAllProducts();
    //this.user = this.auth.user;
    this.auth.user.subscribe(res => {
      this.user = res;
    })
    console.log(this.cartItemCount);
  }

  signOut() {
    this.auth.signOut();
  }

  async openProductModal() {
    const modal = await this.modalController.create({
      component: BuyerListDetailsPage,
      cssClass: 'cart-modal'
    });
    modal.present();
  }

  async openCart() {
    const modal = await this.modalController.create({
      component: CartModalPage,
      cssClass: 'cart-modal'
    });
    modal.present();
  }

  async userAccount() {
    const modal = await this.modalController.create({
      component: AccountPage,
      cssClass: 'cart-modal' 
    });
    modal.present();
  }
}
