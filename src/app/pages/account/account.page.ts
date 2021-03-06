import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {
  user: any;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authService.user.subscribe(res => {
      this.user = res;
    })
  }

}
