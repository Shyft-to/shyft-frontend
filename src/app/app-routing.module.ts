import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccessToNftComponent } from './modules/static/components/access-to-nft/access-to-nft.component';
import { GetApiPageComponent } from './modules/static/components/get-api-page/get-api-page.component';
import { LandingComponent } from './modules/static/components/landing/landing.component';
import { TermsComponent } from './modules/static/components/terms/terms.component';
import { AuthGuardService } from './services/auth/auth-guard.service';

const routes: Routes = [
  {
    path: '',
    component: LandingComponent,
  },
  {
    path: 'get-api-key',
    component: GetApiPageComponent,
  },
  {
    path: 'access-to-nft',
    component: AccessToNftComponent,
  },
  {
    path: 'terms',
    component: TermsComponent,
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./modules/authentication/authentication.module')
      .then(a=>a.AuthenticationModule),
      // canActivate: [AuthGuardService],
  }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
