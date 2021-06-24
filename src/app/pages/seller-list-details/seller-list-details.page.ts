import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { NavController } from '@ionic/angular';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-seller-list-details',
  templateUrl: './seller-list-details.page.html',
  styleUrls: ['./seller-list-details.page.scss'],
})
export class SellerListDetailsPage implements OnInit {

  productForm: FormGroup;
  productImageBase64;

  constructor(private fb: FormBuilder, private productService: ProductService,
    private navigationController: NavController, private camera: Camera) { }

  ngOnInit() {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      price: ['', Validators.required],
      description: ['', Validators.required],
      img: ''
    });
  }

  listProduct() {
    this.productService.addProduct(this.productForm.value).then(res => {
      this.navigationController.pop();
    });
    this.productForm.reset();
  }
  
  selectImage() {
    const options: CameraOptions = {
      quality: 70,
      destinationType: 0,
      mediaType: 0,
      sourceType: 1,
      correctOrientation: true
    }

    this.camera.getPicture(options).then(data => {
      console.log(data);
      this.productImageBase64 = 'data:image/jpeg;base64,' + data;
      this.productForm.patchValue({ img: data })
    });
  }

}
