import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingComponent } from './components/landing/landing.component';
import { SharedModule } from '../shared/shared.module';
import { GetApiPageComponent } from './components/get-api-page/get-api-page.component';
import { AccessToNftComponent } from './components/access-to-nft/access-to-nft.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GetApiService } from 'src/app/core/http/get-api.service';



@NgModule({
  declarations: [
    LandingComponent,
    GetApiPageComponent,
    AccessToNftComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ],
  providers: [
    GetApiService,
  ]
})
export class StaticModule { }
