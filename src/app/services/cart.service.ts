import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cart = [];
  private cartItems = new BehaviorSubject([]);
  private cartItemCount = new BehaviorSubject(0);
 
  constructor() {

  }
 
  // Return the cart as an observable to allow for dynamic updating
  getCart() {
    return this.cartItems.asObservable();
  }
 
  getCartItemCount() {
    return this.cartItemCount;
  }
 
  // Using the stack feature to push a new element to the product array
  addProduct(product) {
    let added = false;
    for (let p of this.cart) {
      if (p.id === product.id) {
        p.amount += 1;
        added = true;
        break;
      }
    }
    if (!added) {
      product.amount = 1;
      this.cart.push(product);
    }
    this.cartItems.next(this.cart);
    this.cartItemCount.next(this.cartItemCount.value + 1);
  }
 
  // Using stacks to add and remove products
  // Here we use the push and splice to the index of the array
  decreaseProduct(product) {
    for (let [index, p] of this.cart.entries()) {
      if (p.id === product.id) {
        p.amount -= 1;
        if (p.amount == 0) {
          this.cart.splice(index, 1);
        }
      }
    }
    this.cartItems.next(this.cart);
    this.cartItemCount.next(this.cartItemCount.value - 1);
  }
 
  removeProduct(product) {
    for (let [index, p] of this.cart.entries()) {
      if (p.id === product.id) {
        this.cartItemCount.next(this.cartItemCount.value - p.amount);
        this.cart.splice(index, 1);
      }
    }
    this.cartItems.next(this.cart);
  }

  getItemCount(id) {
    for (let [index, p] of this.cart.entries()) {
      if (p.id === id) {
        return p.amount;
      }
    }
    return 0;
  }
}