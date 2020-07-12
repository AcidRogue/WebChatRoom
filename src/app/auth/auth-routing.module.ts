import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import {AuthService} from "./auth.service";
import {UserBackendService} from "../http/user-http";
import {RegisterComponent} from "./register/register.component";
import {ServerBackendService} from "../http/server-http";

const loginRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent},
];

@NgModule({
  imports: [
    RouterModule.forRoot(loginRoutes)
  ],
  exports: [
    RouterModule
  ],
  providers: [
      AuthService,
      UserBackendService,
      ServerBackendService
  ]
})
export class AuthRoutingModule {}