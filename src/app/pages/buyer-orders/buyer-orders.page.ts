import { Component, OnInit } from '@angular/core';
import { tap } from 'rxjs/operators';
import { ProductService } from 'src/app/services/product.service';

import { InAppBrowser } from '@ionic-native/in-app-browser/ngx'
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-buyer-orders',
  templateUrl: './buyer-orders.page.html',
  styleUrls: ['./buyer-orders.page.scss'],
})
export class BuyerOrdersPage implements OnInit {

  constructor(private productService: ProductService, private iab: InAppBrowser,
    private loadingCtrl: LoadingController) { }
  payments = [];
  items = [];

  async ngOnInit() {
    const loading = await this.loadingCtrl.create();
    await loading.present();
    (await this.productService.getCustomerOrders()).subscribe(res => {
      console.log('Observed Orders:', res);
      this.payments = res.data;

      this.payments.map(item => {
        item.order = this.productService.getOrderDetails(item.id).pipe(
          tap(data => {
            if (data) {
              for (let item of data['items']) {
                if (!this.items[item.id]) {
                  this.items[item.id] = {};
                  this.productService.getOneProduct(item.id).pipe(
                    tap(product => {
                      console.log('product: ', product);
                      this.items[item.id].name = product['name'];
                    })
                  ).subscribe();
                }
              }
            }
          })
        )
        return item;
      });
      loading.dismiss();
    });
  }

  openInvoice(item) {
    this.productService.getOrderDetails(item.id).subscribe(item => {
      const browser = this.iab.create(item['invoice'], '_system');
    });
  }

}
