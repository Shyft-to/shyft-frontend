import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateNftPageComponent } from './components/create-nft-page/create-nft-page.component';
import { SharedModule } from '../shared/shared.module';
import { AuthenticationRoutingModule } from './authentication-routing.module';
import { ReadNftPageComponent } from './components/read-nft-page/read-nft-page.component';
import { ListNftPageComponent } from './components/list-nft-page/list-nft-page.component';
import { AuthenticationComponent } from './authentication.component';



@NgModule({
  declarations: [
    CreateNftPageComponent,
    ReadNftPageComponent,
    ListNftPageComponent,
    AuthenticationComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    AuthenticationRoutingModule,
  ]
})
export class AuthenticationModule { }
