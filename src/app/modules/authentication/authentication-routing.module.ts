import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CreateNftPageComponent } from './components/create-nft-page/create-nft-page.component';
import { ReadNftPageComponent } from './components/read-nft-page/read-nft-page.component';
import { ListNftPageComponent } from './components/list-nft-page/list-nft-page.component';
import { AuthenticationComponent } from './authentication.component';

const routes: Routes = [
  {
    path: '',
    component: AuthenticationComponent,
    children: [
      {
        path: 'create-nft',
        component: CreateNftPageComponent,
      },
      {
        path: 'read-nft',
        component: ReadNftPageComponent,
      },
      {
        path: 'list-nft',
        component: ListNftPageComponent,
      },
      {
        path: '',
        redirectTo: '/dashboard/create-nft',
        pathMatch: 'full',
      }
    ]
  },
  // {
  //   path: 'create-nft',
  //   component: CreateNftPageComponent,
  // },
  // {
  //   path: 'read-nft',
  //   component: ReadNftPageComponent,
  // },
  // {
  //   path: 'list-nft',
  //   component: ListNftPageComponent,
  // },
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule],
})
export class AuthenticationRoutingModule { }
