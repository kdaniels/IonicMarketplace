import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AngularFireAuthGuard, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { RoleGuard } from './guards/role.guard';
import { AutomaticLoginGuard } from './guards/automatic-login.guard';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['/']);

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule),
    canActivate: [AutomaticLoginGuard]
  },
  {
    path: 'buyer',
    canActivate: [AngularFireAuthGuard, RoleGuard],
    data: {
      authGuardPipe: redirectUnauthorizedToLogin,
      role: 'BUYER'
    },
    children: [
      {
        path: 'list',
        loadChildren: () => import('./pages/buyer-list/buyer-list.module').then( m => m.BuyerListPageModule)
      },
      {
        path: 'list/:id',
        loadChildren: () => import('./pages/buyer-list-details/buyer-list-details.module').then( m => m.BuyerListDetailsPageModule),
      },
      {
        path: 'checkout',
        loadChildren: () => import('./pages/checkout/checkout.module').then( m => m.CheckoutPageModule)
      },
      {
        path: 'orders',
        loadChildren: () => import('./pages/buyer-orders/buyer-orders.module').then( m => m.BuyerOrdersPageModule)
      },
      {
        path: 'accountpage',
        loadChildren: () => import('./pages/account/account.module').then( m => m.AccountPageModule)
      },
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: 'seller',
    canActivate: [AngularFireAuthGuard, RoleGuard],
    data: {
      authGuardPipe: redirectUnauthorizedToLogin,
      role: 'SELLER'
    },
    children: [
      {
        path: 'list',
        loadChildren: () => import('./pages/seller-list/seller-list.module').then( m => m.SellerListPageModule)
      },
      {
        path: 'list/new',
        loadChildren: () => import('./pages/seller-list-details/seller-list-details.module').then( m => m.SellerListDetailsPageModule)
      },
      {
        path: 'account',
        loadChildren: () => import('./pages/account/account.module').then( m => m.AccountPageModule)
      },
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full'
      },
    ]
  },   {
    path: 'cart-modal',
    loadChildren: () => import('./pages/cart-modal/cart-modal.module').then( m => m.CartModalPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
