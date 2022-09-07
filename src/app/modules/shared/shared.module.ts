import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { SideNavComponent } from './components/side-nav/side-nav.component';
import { LoaderComponent } from './components/loader/loader.component';
import { DarkHeaderComponent } from './components/dark-header/dark-header.component';
import { DarkFooterComponent } from './components/dark-footer/dark-footer.component';



@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    SideNavComponent,
    LoaderComponent,
    DarkHeaderComponent,
    DarkFooterComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
  ],
  exports: [HeaderComponent, FooterComponent, LoaderComponent],
})
export class SharedModule { }
