import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateNftPageComponent } from './components/create-nft-page/create-nft-page.component';
import { SharedModule } from '../shared/shared.module';
import { AuthenticationRoutingModule } from './authentication-routing.module';
import { ReadNftPageComponent } from './components/read-nft-page/read-nft-page.component';
import { ListNftPageComponent } from './components/list-nft-page/list-nft-page.component';
import { AuthenticationComponent } from './authentication.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { ClipboardModule } from 'ngx-clipboard';
import { SolanaCreateNftPageComponent } from './components/solana-create-nft-page/solana-create-nft-page.component';

@NgModule({
  declarations: [
    CreateNftPageComponent,
    ReadNftPageComponent,
    ListNftPageComponent,
    AuthenticationComponent,
    SolanaCreateNftPageComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    AuthenticationRoutingModule,
    ToastrModule.forRoot({
      preventDuplicates: true,
    }),
    ClipboardModule,
  ]
})
export class AuthenticationModule { }
