import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-buyer-list-details',
  templateUrl: './buyer-list-details.page.html',
  styleUrls: ['./buyer-list-details.page.scss'],
})
export class BuyerListDetailsPage implements OnInit {
  id = null;
  product = null;
  amount = 0;

  constructor(private router: ActivatedRoute, private productService: ProductService,
    private cartService: CartService) { }

  ngOnInit() {
    this.id = this.router.snapshot.paramMap.get('id');
    this.productService.getOneProduct(this.id).subscribe(res => {
      //console.log('Observed Product: ', res);
      this.product = res;
      this.product.id = this.id;
      this.amount = this.cartService.getItemCount(this.id);
    });

    this.cartService.getCart().subscribe(cart => {
      console.log('cart: ', cart);
      this.amount = this.cartService.getItemCount(this.id);
    })
  }

  addToCart() {
    this.cartService.addProduct(this.product);
  }

  decreaseCart() {
    if (this.cartService.getItemCount(this.id) == 1) {
      this.removeFromCart();
    } else {
      this.cartService.decreaseProduct(this.product);
    }
  }

  removeFromCart() { 
    this.cartService.removeProduct(this.product);
  }
}
