import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LogoutGuard } from './logout.guard';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  { path: '', loadChildren: () => import('./login/login.module').then(m => m.LoginModule),canActivate:[LogoutGuard]},
  { path: 'autorizado', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule),canActivate: [AuthGuard]},
  { path: '**',  redirectTo: ''},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
