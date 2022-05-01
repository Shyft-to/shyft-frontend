import { Component, Input, OnInit } from '@angular/core';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Input() isAuthenticated: boolean = false;
  isSidenavActive: boolean = false;
  isMenuActive: boolean = false;
  constructor(public breakpointObserver: BreakpointObserver, private auth: AuthService) {}
  ngOnInit(): void {
    this.isAuthenticated = this.auth.IsLoggedIn();
    this.breakpointObserver
      .observe(['(min-width: 1100px)'])
      .subscribe((state: BreakpointState) => {
        if (state.matches && this.isAuthenticated) {
          this.isSidenavActive = true;
          this.isMenuActive = false;
          console.log('Viewport width is 500px or greater!');
        } else {
          this.isSidenavActive = false;
          this.isMenuActive = true;
          console.log('Viewport width is less than 500px!');
        }
      });
  }

  toggleSidenav($event: boolean) {
    this.isSidenavActive = $event;
    this.isMenuActive = $event;
  }

  openSidenav() {
    this.isSidenavActive = !this.isSidenavActive;
  }
}

