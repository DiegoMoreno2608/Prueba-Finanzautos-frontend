import { Routes } from '@angular/router';

import { LoginComponent } from './Pages/auth/login/login.component';
import { ProductsSearchComponent } from './Pages/inicio/products-search.component';
import { authGuard } from './Services/auth.guard';
import { CreateProductComponent } from './Pages/products/create-product/create-product.component';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'inicio', component: ProductsSearchComponent, canActivate: [authGuard] },
  { path: 'nuevo/:id', component: CreateProductComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '' }
];
