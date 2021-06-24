import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-seller-list',
  templateUrl: './seller-list.page.html',
  styleUrls: ['./seller-list.page.scss'],
})
export class SellerListPage implements OnInit {
  products: Observable<any>;

  constructor(private auth: AuthService, private productService: ProductService) { }

  async ngOnInit() {
    this.products = (await this.productService.getSellerProducts())
  }

  deleteItem(id) {
    this.productService.deleteProduct(id);
  }

  signOut() {
    this.auth.signOut();
  }

}
