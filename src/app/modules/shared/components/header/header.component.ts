import { Component, Input, OnInit } from '@angular/core';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Input() isAuthenticated: boolean = false;
  isSidenavActive: boolean = false;
  isMenuActive: boolean = false;
  isDashboardUrl: boolean = false;
  constructor(
    public breakpointObserver: BreakpointObserver,
    private auth: AuthService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.isDashboardUrl = this.router.url.includes('/dashboard');
    this.isAuthenticated = this.auth.IsLoggedIn();
    this.breakpointObserver
      .observe(['(min-width: 1100px)'])
      .subscribe((state: BreakpointState) => {
        if (state.matches && this.isAuthenticated) {
          this.isSidenavActive = true;
          this.isMenuActive = false;
        } else {
          this.isSidenavActive = false;
          this.isMenuActive = true;
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

