import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  registrationForm: FormGroup;
  loginForm: FormGroup;

  @ViewChild('flipcontainer', {static: false})flipcontainer: ElementRef;

  constructor(private formBuild: FormBuilder, private authService: AuthService,
    private loadingController: LoadingController, private toastController: ToastController,
    private alertController: AlertController, private router: Router) { }

  // Assign an account based on the parameters specified
  ngOnInit() {
    this.registrationForm = this.formBuild.group({ 
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      name: ['', Validators.required],
      role: ['BUYER', Validators.required]
    });

    this.loginForm = this.formBuild.group({ 
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  navigateByRole(role) {
    if (role == 'BUYER') {
      this.router.navigateByUrl('/buyer');
    } else if (role == 'SELLER') {
      this.router.navigateByUrl('/seller');
    }
  }

  /** Method to Log the user in and authenticate their session
   * Using Firebase authentication and signinwithemailandpassword
   */
  async login() {
    let load = await this.loadingController.create({
      message: 'Loading...'
    });
    await load.present();

    this.authService.signIn(this.loginForm.value).subscribe(user => {
      load.dismiss();
      this.navigateByRole(user['role']);

    }, async err => {
      load.dismiss();

      let alert = await this.alertController.create({
        header: 'Error',
        message: err.message,
        buttons: ['Ok']
      });
      alert.present();
    });
    this.loginForm.reset();
  }

  async register() {
    let load = await this.loadingController.create({
      message: 'Loading...'
    });
    await load.present();

    this.authService.signUp(this.registrationForm.value).then(async res => {
      await load.dismiss();
      
      let toast = await this.toastController.create({
        duration: 3000,
        message: 'Successfully added new account to Firebase!'
      });
      toast.present();
      console.log('finished: ', res);
      this.navigateByRole(this.registrationForm.value['role']);
      
    }, async err => {
      load.dismiss();

      let alert = await this.alertController.create({
        header: 'Error',
        message: err.message,
        buttons: ['Ok']
      });
      alert.present();
    });
    this.registrationForm.reset();
  }

  toggleRegister() {
    this.flipcontainer.nativeElement.classList.toggle('flip');
  }

}
